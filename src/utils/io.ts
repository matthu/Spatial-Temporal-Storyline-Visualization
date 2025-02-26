import * as xml2js from 'xml2js'
import { CharactersJson, Story, StoryJson } from '../data/story';

export function parseXMLFile(xml: XMLDocument, story: Story) {
  story.restore()
  let storyNode = xml.querySelector('Story')
  if (storyNode) {
    let characters = storyNode.querySelector('Characters')
    if (!characters) return;
    let allCharacters = characters.querySelectorAll('Character')
    if (!allCharacters) return;
    for (let character of allCharacters) {
      let name = character.getAttribute('Name')
      if (name != null) {
        story._characters.push(name)
      }
      let spans = character.querySelectorAll('Span')
      for (let span of spans) {
        let start = parseInt(span.getAttribute('Start') as string)
        let end = parseInt(span.getAttribute('End') as string)
        story._timeStamps.push(start, end)
      }
    }
    const timeset = new Set(story._timeStamps)
    story._timeStamps = Array.from(timeset)
    story._timeStamps.sort((a, b) => a - b)
    let sessionTable = story._tableMap.get('session')
    let characterTable = story._tableMap.get('character')
    let locationTable = story._tableMap.get('location')
    for (let table of [sessionTable, characterTable, locationTable]) {
      table?.resize(story._characters.length, story._timeStamps.length - 1)
    }
    for (let character of allCharacters) {
      let spans = character.querySelectorAll('Span')
      let characterName = character.getAttribute('Name') as string
      let characterId = story._characters.indexOf(characterName)
      for (let span of spans) {
        let start = parseInt(span.getAttribute('Start') as string)
        let end = parseInt(span.getAttribute('End') as string)
        let timeId = story._timeStamps.indexOf(start)
        let timeIdend = story._timeStamps.indexOf(end)
        let sessionIdStr = span.getAttribute('Session') as string
        let sessionId = parseInt(sessionIdStr)
        if (sessionId) {
          story._maxSessionID = Math.max(story._maxSessionID, sessionId)
          for (let id = timeId; id < timeIdend; id++) {
            characterTable?.replace(characterId, id, 1)
            sessionTable?.replace(characterId, id, sessionId)
          }
        }
      }
    }
    //parse the location part
    let locations = storyNode.querySelector('Locations')
    if (!locations) return;
    let allLocations = storyNode.querySelectorAll('Location')
    for (let location of allLocations) {
      let locationTable = story._tableMap.get('location')
      let sessionTable = story._tableMap.get('session')
      let characterTable = story._tableMap.get('character')
      let locationName = location.getAttribute('Name')
      if (locationName) {
        story._locations.push(locationName)
      }
      const locationId = story._locations.length - 1
      let sessionsInthislocationStr = location?.getAttribute('Sessions')?.split(',')
      let sessionsInthislocation = sessionsInthislocationStr?.map(x => parseInt(x))

      if (sessionTable && locationTable && characterTable) {
        for (let i = 0; i < sessionTable.rows; i++)
          for (let j = 0; j < sessionTable.cols; j++) {
            let rightSession =
              sessionsInthislocation?.indexOf(sessionTable.value(i, j) as number) !== -1
            if (characterTable.value(i, j) === 1 && rightSession) {
              locationTable.replace(i, j, locationId)
            }
          }
        }
      }
  } else {
    console.warn('No story can be found through this url!')
  }
}

export function parseJSONFile(json: StoryJson, story: Story) {
  // let jsonObject=JSON.parse(json)
  story.restore()
  let storyJson = json.Story
  let locations = storyJson.Locations
  let characters = storyJson.Characters
  for (let character in characters) {
    let name = character
    story._characters.push(name)
    let spans = characters[name]
    for (let span of spans) {
      let start = parseInt(span['Start'].toString())
      let end = parseInt(span['End'].toString())
      story._timeStamps.push(start, end)
      let session = parseInt(span['Session'].toString())
      story._maxSessionID = Math.max(story._maxSessionID, session)
    }
  }
  const timeset = new Set(story._timeStamps)
  story._timeStamps = Array.from(timeset)
  story._timeStamps.sort((a, b) => a - b)
  let sessionTable = story._tableMap.get('session')
  let characterTable = story._tableMap.get('character')
  let locationTable = story._tableMap.get('location')
  for (let table of [sessionTable, characterTable, locationTable]) {
    table?.resize(story._characters.length, story._timeStamps.length - 1)
  }
  for (let character in characters) {
    let characterName = character
    let spans = characters[characterName]
    let characterId = story._characters.indexOf(characterName)
    for (let span of spans) {
      let start = parseInt(span['Start'].toString())
      let end = parseInt(span['End'].toString())
      let timeId = story._timeStamps.indexOf(start)
      let timeIdend = story._timeStamps.indexOf(end)
      let sessionId = span['Session']
      sessionId = parseInt(sessionId.toString())
      for (let id = timeId; id < timeIdend; id++) {
        characterTable?.replace(characterId, id, 1)
        sessionTable?.replace(characterId, id, sessionId)
      }
    }
  }
  //parse the location part
  for (let locationName in locations) {
    let location = locations[locationName]
    let locationTable = story._tableMap.get('location')
    let sessionTable = story._tableMap.get('session')
    let characterTable = story._tableMap.get('character')
    story._locations.push(locationName)
    const locationId = story._locations.length - 1
    let sessionsInthislocation = location
    sessionsInthislocation = sessionsInthislocation.map(x => parseInt(x.toString()))
    if (sessionTable && locationTable && characterTable) {
      for (let i = 0; i < sessionTable.rows; i++)
        for (let j = 0; j < sessionTable.cols; j++) {
          let rightSession =
            sessionsInthislocation.indexOf(sessionTable.value(i, j) as number) !== -1
          if (characterTable.value(i, j) === 1 && rightSession) {
            locationTable.replace(i, j, locationId)
          }
        }
      }
    }
}

// @deprecated
export function dumpXMLFile(fileName: string, story: Story) {
  if (fileName.indexOf('.xml') == -1) fileName += '.xml '
  const JSONFile = generateJSONFile(story)
  const xmlObj = json2xml(JSONFile)
  let builder = new xml2js.Builder()
  let xml = builder.buildObject(xmlObj)
  downloadFile(fileName, xml)
}

export function dumpJSONFile(fileName: string, story: Story) {
  if (fileName.indexOf('.json') == -1) fileName += '.json'
  let storyJson = generateJSONFile(story)
  downloadFile(fileName, JSON.stringify(storyJson))
}

export function generateJSONFile(story: Story) {
  let locationsJson = dumpJsonLocation(story)
  let charactersJson = dumpJsonCharacters(story)
  let storyJson: StoryJson = {
    Story: { Locations: locationsJson, Characters: charactersJson },
  }
  return storyJson
}

function dumpJsonLocation(story: Story) {
  let locationsJson: {[name: string]: number[]} = {}
  let locations = story._locations
  for (let location of locations) {
    let sessions = story.getLocationSessions(location)
    if (sessions.length > 0) {
      locationsJson[location] = sessions
    }
  }
  return locationsJson
}

function dumpJsonCharacters(story: Story) {
  let charactersJson: {[name: string]: CharactersJson[]} = {}
  let characters = story._characters
  for (let character of characters) {
    let timeStamps = story.getCharacterTimeRange(character)
    let spansJson: any[] = []
    for (let timeStamp of timeStamps) {
      let [start, end] = timeStamp
      let sessionId = story.getSessionID(start, character)
      let spanJson = { Start: start, End: end, Session: sessionId }
      spansJson.push(spanJson)
    }
    charactersJson[character] = spansJson
  }
  return charactersJson
}

// https://github.com/Leonidas-from-XIV/node-xml2js
function json2xml(jsonFile: StoryJson) {
  return jsonFile
}

function downloadFile(fileName: string, content: any) {
  let aLink = document.createElement('a')
  let blob = new Blob([content])
  aLink.download = fileName
  aLink.style.display = 'none'
  aLink.href = URL.createObjectURL(blob)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}
