export function buildMotivationPrompt() {
  return `Generate a short, inspiring motivational fitness quote (1-2 sentences max). Make it encouraging, positive, and relevant to fitness goals. Return only the quote text, no additional formatting.`;
}

export function buildImagePrompt(itemName, type) {
  if (type === "exercise") {
    return `realistic professional photography of ${itemName} exercise in a gym, proper form, well-lit, high quality, detailed`;
  } else {
    return `delicious ${itemName} food photography, professional lighting, high quality, appetizing, detailed, on a plate`;
  }
}

