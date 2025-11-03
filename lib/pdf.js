import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportPlanToPDF(planData, userData) {
  try {
    // Create a container element
    const container = document.createElement("div");
    // Optimize container for better rendering and smaller file size
    container.style.width = "210mm"; // A4 width
    container.style.padding = "15mm"; // Reduced padding
    container.style.backgroundColor = "#ffffff";
    container.style.fontFamily = "-apple-system, BlinkMacSystemFont, Arial, sans-serif"; // System fonts
    container.style.color = "#000000";
    container.style.lineHeight = "1.4"; // Optimized line height
    container.style.textRendering = "optimizeLegibility";
    container.style.webkitFontSmoothing = "antialiased";
    
    // Build HTML content
    let htmlContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; margin: 0; color: #1e40af;">AI Fitness Coach Plan</h1>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">Generated on ${new Date().toLocaleDateString()}</p>
      </div>
      
      <div style="margin-bottom: 20px; background: #f3f4f6; padding: 12px; border-radius: 6px;">
        <h2 style="font-size: 18px; margin: 0 0 12px 0; color: #1e40af;">User Information</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
          <p><strong>Name:</strong> ${userData?.name || "N/A"}</p>
          <p><strong>Age:</strong> ${userData?.age || "N/A"}</p>
          <p><strong>Gender:</strong> ${userData?.gender || "N/A"}</p>
          <p><strong>Height:</strong> ${userData?.height || "N/A"} cm</p>
          <p><strong>Weight:</strong> ${userData?.weight || "N/A"} kg</p>
          <p><strong>Goal:</strong> ${userData?.goal || "N/A"}</p>
        </div>
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 20px; margin: 0 0 16px 0; color: #1e40af; border-bottom: 1px solid #1e40af; padding-bottom: 8px;">🏋️ Workout Plan</h2>
    `;
    
    // Add workout routines
    if (planData.workout?.dailyRoutines) {
      planData.workout.dailyRoutines.forEach((routine) => {
        htmlContent += `
          <div style="margin-bottom: 25px; page-break-inside: avoid;">
            <h3 style="font-size: 18px; color: #2563eb; margin: 0 0 15px 0;">${routine.day}</h3>
        `;
        
        if (routine.exercises && routine.exercises.length > 0) {
          routine.exercises.forEach((exercise, idx) => {
            htmlContent += `
              <div style="background: #f9fafb; padding: 15px; margin-bottom: 15px; border-left: 4px solid #2563eb; border-radius: 4px;">
                <h4 style="font-size: 16px; margin: 0 0 10px 0; color: #1e40af;">${idx + 1}. ${exercise.name}</h4>
                <div style="font-size: 12px; color: #374151; line-height: 1.6;">
                  <p style="margin: 5px 0;"><strong>Sets:</strong> ${exercise.sets}</p>
                  <p style="margin: 5px 0;"><strong>Reps:</strong> ${exercise.reps}</p>
                  <p style="margin: 5px 0;"><strong>Rest:</strong> ${exercise.rest}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Instructions:</strong> ${exercise.description || "N/A"}</p>
                </div>
              </div>
            `;
          });
        }
        
        htmlContent += `</div>`;
      });
    }
    
    htmlContent += `
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">🥗 Diet Plan</h2>
    `;
    
    // Add diet meals
    if (planData.diet?.meals) {
      planData.diet.meals.forEach((meal) => {
        htmlContent += `
          <div style="margin-bottom: 25px; page-break-inside: avoid;">
            <h3 style="font-size: 18px; color: #2563eb; margin: 0 0 15px 0;">${meal.meal}</h3>
        `;
        
        if (meal.foods && meal.foods.length > 0) {
          meal.foods.forEach((food) => {
            htmlContent += `
              <div style="background: #f9fafb; padding: 15px; margin-bottom: 15px; border-left: 4px solid #16a34a; border-radius: 4px;">
                <h4 style="font-size: 16px; margin: 0 0 10px 0; color: #1e40af;">${food.name}</h4>
                <div style="font-size: 12px; color: #374151; line-height: 1.6;">
                  <p style="margin: 5px 0;"><strong>Portion:</strong> ${food.portion}</p>
                  <p style="margin: 5px 0;"><strong>Calories:</strong> ${food.calories}</p>
                  <p style="margin: 10px 0 0 0;"><strong>Details:</strong> ${food.description || "N/A"}</p>
                </div>
              </div>
            `;
          });
        }
        
        htmlContent += `</div>`;
      });
    }
    
    htmlContent += `
      </div>
      
      <div style="margin-bottom: 30px;">
        <h2 style="font-size: 22px; margin: 0 0 20px 0; color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">💡 AI Tips & Motivation</h2>
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
          <p style="font-size: 14px; font-style: italic; color: #78350f; margin: 0 0 15px 0;">"${planData.motivation || "Stay consistent and you'll achieve your goals!"}"</p>
        </div>
        <ul style="margin-top: 20px; padding-left: 20px;">
    `;
    
    if (planData.tips && planData.tips.length > 0) {
      planData.tips.forEach((tip) => {
        htmlContent += `<li style="margin-bottom: 10px; font-size: 13px; color: #374151;">${tip}</li>`;
      });
    }
    
    htmlContent += `
        </ul>
      </div>
      
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280;">
        <p>Generated by AI Fitness Coach • ${new Date().toLocaleString()}</p>
      </div>
    `;
    
    container.innerHTML = htmlContent;
    document.body.appendChild(container);
    
    // Generate canvas from HTML with optimized settings
    const canvas = await html2canvas(container, {
      scale: 1.5,  // Reduced from 2 to 1.5 for better balance of quality and size
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false, // Disable logging
      imageTimeout: 0, // No timeout
      removeContainer: true // Auto cleanup
    });
    
    // Remove container from DOM
    document.body.removeChild(container);
    
    // Create PDF with optimization settings
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true // Enable compression
    });

    // Convert canvas to compressed JPEG instead of PNG
    const imgData = canvas.toDataURL("image/jpeg", 0.85); // 85% quality JPEG
    
    // Calculate dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add pages with compressed images
    let heightLeft = imgHeight;
    let position = 0;
    
    // Add first page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, null, 'FAST');
    heightLeft -= pageHeight;
    
    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, null, 'FAST');
      heightLeft -= pageHeight;
    }
    
    // Save PDF
    const fileName = `fitness-plan-${userData?.name || "user"}-${Date.now()}.pdf`;
    pdf.save(fileName);
    
    return true;
  } catch (error) {
    console.error("PDF export error:", error);
    throw error;
  }
}

