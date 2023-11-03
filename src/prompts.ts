import OpenAI from 'openai'

import { CharacterDoc } from './pages/Character'
import { SceneDoc, StorylineDoc, ActDoc, PanelDoc } from './fireproof'
import { Database } from 'use-fireproof'

class PromptsClient {
  private client: OpenAI
  private database: Database

  constructor(apiKey: string, database: Database) {
    this.client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })
    this.database = database
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
    const prompt = `In the flat-colored style of a modern comic book, render a full length sketch (including head) of: ${character.imagePrompt.substring(
      0,
      900
    )}`
    const response = await this.client.images.generate({
      prompt,
      n: 4,
      size: '512x512'
    })
    console.log('image', response)
    const image_urls = response.data.map(m => m.url)
    return image_urls
  }

  generateFaceImages = async (character: CharacterDoc) => {
    if (!character.imagePrompt) {
      throw new Error('Character does not have aimagePrompt')
    }
    const prompt = `In the flat-colored style of a modern comic book, render the face of: ${character.imagePrompt.substring(
      0,
      900
    )}`
    const response = await this.client.images.generate({
      prompt,
      n: 4,
      size: '512x512'
    })
    console.log('image', response)
    const image_urls = response.data.map(m => m.url)
    return image_urls
  }

  generateActsFromStoryline = async (storyline: StorylineDoc, numActs = 4) => {
    const prompt = `Compose an act-level outline of the following storyline, formatted into ${numActs} acts.

    Example Act Format:
    Act I: [Act Title]
    
    [Scene Title 1]: Provide a brief description of what happens in this scene, introducing characters, events, or situations as relevant.
    [Scene Title 2]: Provide a brief description of what happens in this scene.
    [Scene Title 3]: Provide a brief description of what happens in this scene.

    Each act can contain between 3 and 7 scenes, and the scenes should be titled to reflect key events or character developments. The description should provide enough detail to understand the key points of the scene. Repeat this structure for all ${numActs} acts.
    
    Create an act-level outline for the following storyline: ${storyline.description}`

    const rawResponse = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You will act as a writing assistant, following the suggested format.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      max_tokens: 1024
    })
    console.log('gpt-4', rawResponse)

    const response = rawResponse.choices[0].message.content!

    for (let i = 0; i < numActs; i++) {
      const actInfo = await this.parseActFromResponse(response, i + 1)
      actInfo.number = i + 1
      actInfo.storylineId = storyline._id
      actInfo.type = 'act'

      const scenes = actInfo.scenes

      console.log('scenes', scenes)

      delete actInfo.scenes

      console.log('actInfo', i + 1, actInfo)
      const ok = await this.database.put(actInfo)
      let pos = 0
      for (const scene of scenes) {
        const sceneInfo: SceneDoc = {
          title: scene,
          actId: ok.id,
          type: 'scene',
          updated: Date.now(),
          created: Date.now(),
          position: pos++
        }
        console.log('sceneInfo', sceneInfo)
        await this.database.put(sceneInfo)
      }
    }
  }

  parseActFromResponse = async (content: string, act: number) => {
    const functions = [
      {
        name: 'save_act_and_scenes',
        description: 'Save an act and its scenes to the database',
        parameters: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The title of the act'
            },
            scenes: {
              type: 'array',
              items: {
                type: 'string',
                description: 'A brief description of the scene'
              }
            }
          }
        }
      }
    ]

    const extractPrompt = `Call the save_act_and_scenes function by extracting the act-level outline for act ${act} from the following text. Remove any reference to position from the act and scene descriptions, eg "Act III: The Happening" should be transformed to "The Happening" or "Scene 1: The Event: Foo bar..." should become "The Event: Foo bar...": ${content}`

    const response = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You will extract the act-level outline for act ${act} from the response and save it to the database.`
        },
        { role: 'user', content: extractPrompt }
      ],
      functions,
      temperature: 0,
      max_tokens: 1024
    })

    console.log('gpt-3', response)

    return JSON.parse(response.choices[0].message.function_call!.arguments)
  }

  generatePanelsFromScene = async (
    storyline: StorylineDoc,
    act: ActDoc,
    scene: SceneDoc,
    max: number = 10
  ) => {
    const prompt = `
      Generate ${Math.floor(
        max / 2
      )} to ${max} storyboard panels for the following scene, which will be formatted into a comic book page. Each panel should have a narrative description, a visual prompt, and a caption, each one sentence long.

      Storyline: ${storyline.description}

      Act ${act.number}: ${act.title}

      Scene: ${scene.title}

      Generate ${Math.floor(max / 2)} to ${max} panels in outline format
    `
    console.log('prompt', prompt)

    const rawResponse = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You will act as a writing assistant, following the suggested format.`
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      max_tokens: 1024
    })
    console.log('gpt-4', rawResponse)

    const response = rawResponse.choices[0].message.content!
    console.log('response', response)
    const { panels } = await this.parsePanelsFromResponse(response)
    let pos = 0
    for (const panel of panels) {
      panel.type = 'panel'
      panel.sceneId = scene._id!
      panel.created = Date.now()
      panel.updated = Date.now()
      panel.position = pos++
      console.log('panel', panel)
      await this.database.put(panel)
    }
  }

  parsePanelsFromResponse = async (content: string) => {
    const countFunctions = [
      {
        name: 'count_panels',
        description: `Report the total number of panels described in the provided text`,
        parameters: {
          type: 'object',
          properties: {
            count: {
              type: 'number',
              description: 'The total number of panels described'
            }
          }
        }
      }
    ]

    const countPrompt = `Call the count_panels function with the total number of panels: ${content}`

    console.log('extractPrompt', countPrompt, countFunctions)

    const countResponse = await this.client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You will extract the panel-level outline from the response and save it to the database.`
        },
        { role: 'user', content: countPrompt }
      ],
      functions: countFunctions,
      temperature: 0,
      max_tokens: 1024
    })

    console.log('gpt-3', countResponse)

    const { count } = JSON.parse(countResponse.choices[0].message.function_call!.arguments)

    console.log('stuff', count)

    const functions = [
      {
        name: 'save_panel',
        description: `Save a panel to the database`,
        parameters: {
          type: 'object',
          properties: {
            narrative: {
              type: 'string',
              description: 'A brief description of the panel'
            },
            visual: {
              type: 'string',
              description: 'A visual prompt for the panel'
            },
            caption: {
              type: 'string',
              description: 'A caption for the panel'
            }
          }
        }
      }
    ]
    const panels = []
    for (let i = 1; i <= count; i++) {
      const extractPrompt = `Call the save_panel function to extracting the panel-level outline from the following text for panel number ${
        i 
      } of ${count}. Remove any reference to position from the panel descriptions, eg "Panel 4: The Happening" should be transformed to "The Happening" etc. Here is the content to parse: ${content}`

      console.log('extractPrompt', extractPrompt, functions)

      const response = await this.client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You will extract the panel from the response and save it to the database.`
          },
          { role: 'user', content: extractPrompt }
        ],
        functions,
        temperature: 0,
        max_tokens: 1024
      })

      console.log('gpt-3', response)

      const panelData = JSON.parse(response.choices[0].message.function_call!.arguments)
      console.log('panelData', panelData)
      panels.push(panelData)
    }
    return { panels }
  }

  generatePanelImages = async (
    storyline: StorylineDoc,
    act: ActDoc,
    scene: SceneDoc,
    panels: PanelDoc[]
  ) => {
    let pos = 0
    for (const panel of panels) {
      const prompt = `In the flat-colored style of a modern comic book, render a panel for the following scene. The most important part of the prompt is labeled "Visual" below. The narrative and caption are provided for context. Don't include dialog, speech bubbles, or labels in the image. Zoom in closely on the action in the visual prompt.

      Visual: ${panel.visual}
      
      Storyline: ${storyline.description}
    
      Act: ${act.title}

      Scene: ${scene.title}

      Panel: ${pos++}

      Narrative: ${panel.narrative}

      Caption: ${panel.caption}
      
      Visual: ${panel.visual}
      
      Reply with a short, detailed prompt to send DALLe2.`

      const rawResponse = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You will act as an art assistant, create an image generation prompt.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
        max_tokens: 1024
      })

      console.log('gpt-4', rawResponse)
      const imagePrompt = rawResponse.choices[0].message.content!

      const response = await this.client.images.generate({
        prompt: imagePrompt,
        n: 4,
        size: '512x512',
        response_format: 'b64_json'
      })
      console.log('image', response)

      const imageFiles = await Promise.all(
        response.data.map(async (m, index) => {
          const base64Data = m.b64_json!
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const file = new File([byteArray], `image${index}.png`, { type: 'image/png' })
          return file
        })
      )

      console.log('imageFiles', imageFiles)
      const files = {}
      for (const [index, file] of imageFiles.entries()) {
        files[`image${index}`] = file
      }
      panel._files = files

      // panel.imageUrls = response.data.map(m => m.url!)
      await this.database.put(panel)
    }
  }
}

async function urlToFile(url, filename, mimeType) {
  const response = await fetch(url)
  const data = await response.blob()
  return new File([data], filename, { type: mimeType })
}

function client(apiKey: string, database: Database) {
  return new PromptsClient(apiKey, database)
}

export { client }
