import OpenAI from 'openai'

import { CharacterDoc } from './pages/Character'

class PromptsClient {
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
  }

  detailedCharacterVisualDescription = async (character: CharacterDoc) => {
    const prompt = `Example:

Detailed Description of Jolene:

Jolene is a remarkable animated character known for her martial arts expertise. A comprehensive description of her unique features is as follows:

Physical Appearance:
Hair: Dominating Jolene's appearance is her massive afro, reminiscent of a dramatic cloud explosion. Its curly and dense texture underlines the concept of force and motion.
Eyes: Almond-shaped and a deep shade of hazel, they convey confidence and concentration.
Facial Features: Pronounced cheekbones, thick and arched eyebrows, and full lips characterize her face. While the lips hint at a faint smile due to the upward curve, the eyes are intense, suggesting constant alertness.
Skin: A warm and rich brown shade envelops her skin.
Attire:
Gi: This animated figure sports a modern martial arts gi in a deep burnt orange color, representing her combat prowess.
Insignia: Embroidered on the gi's left chest side is an emblem: a circle with a design symbolizing balance and harmony.
Accessories: Large golden hoop earrings adorn her ears, and a choker composed of intertwined black and gold threads encircles her neck.
Belt: A black belt encases her waist, marking her as a martial artist of advanced caliber.
Insignia: Jolene's insignia, strategically positioned on the left side of her chest on the martial arts gi, is circumscribed within a circle. This circular boundary, conventionally associated with unity, totality, and infinity, encapsulates a design.

The design within the circle comprises gears or cog-like structures. These gears, typically representative of mechanics, industry, and interconnectivity, symbolize how different elements work in harmony for a greater purpose. The specific arrangement and interlocking of these gears can suggest teamwork, coordination, and the idea that every component, no matter how small, is essential for the whole to function seamlessly.

Given Jolene's martial arts background, this insignia could also symbolize the harmony between mind, body, and spirit, crucial for any martial artist. The mechanical gears could metaphorically represent the various disciplines or techniques in martial arts that need to work in synergy.
Jolene wears distinct pieces of jewelry:

Earrings:
Type: Hoop earrings.
Location: Hung from each earlobe.
Description: Large, golden, circular hoops. Their size and pronounced color make them a notable accessory.
Neck Jewelry:
Type: Choker and necklace combination.
Description:
a. Choker: A golden choker closely wraps around her neck. This choker appears to be constructed of multiple thin, parallel bands.
b. Necklace: Suspended from the choker is a longer necklace that has cylindrical, possibly metallic, elements spaced at regular intervals.

These jewelry pieces are unified by their golden color, suggesting a choice for consistency or preference for this hue. Gold, traditionally, can symbolize wealth, elegance, or a cultural or personal preference for its aesthetic value. The combination of the jewelry items, along with her attire, portrays a blend of modern style with elements that might be influenced by cultural or traditional motifs.
Overall Aura:
Jolene emanates an aura of power combined with elegance. From the magnificence of her afro to her expert martial arts stance, she embodies confidence and mastery. To visualize Jolene correctly, it is imperative to integrate these specifics, distinguishing her from other animated figures.
    
    Character Brief:
${character.name} is a ${character.visualDescription}
`

    const response = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You will write image generation prompts. The user will share an example character description, followed by a character brief for a new character. Reply by imagining a new character description in the format of the example. Your goal is to make image generation of scenes using the character as consistent as possible.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      max_tokens: 1024
    })
    console.log('gpt-4', response)
    return response.choices[0].message.content
  }

  generateProfileImage = async (character: CharacterDoc) => {
    if (!character.imagePrompt) {
      throw new Error('Character does not have aimagePrompt')
    }
    const prompt = `In the flat-colored style of a modern comic book, render a full length sketch (including head) of: ${character.imagePrompt.substring(0, 900)}`
    const response = await this.client.images.generate({
      prompt,
      n: 4,
      size: "512x512",
    })
    console.log('image', response)
    const image_urls = response.data.map((m) => m.url);
    return image_urls
  }

  generateFaceImages = async (character: CharacterDoc) => {
    if (!character.imagePrompt) {
      throw new Error('Character does not have aimagePrompt')
    }
    const prompt = `In the flat-colored style of a modern comic book, render the face of: ${character.imagePrompt.substring(0, 900)}`
    const response = await this.client.images.generate({
      prompt,
      n: 4,
      size: "512x512",
    })
    console.log('image', response)
    const image_urls = response.data.map((m) => m.url);
    return image_urls
  }
}

function client(apiKey: string) {
  return new PromptsClient(apiKey)
}

export { client }
