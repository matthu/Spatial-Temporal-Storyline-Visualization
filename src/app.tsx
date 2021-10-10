import * as React from 'react'

import { logStoryInfo } from './utils/logger'
import { drawStoryline } from './utils/drawer'
import iStoryline from './storyline'

export default function App() {
  async function main(fileName: string) {
    const iStorylineInstance = new iStoryline()
    const fileUrl = `../../data/${fileName.split('.')[1]}/${fileName}`
    let graph = await iStorylineInstance.loadFile(fileUrl)
    // Scale to window size
    const containerDom: any = document.getElementById('mySvg')
    const windowW = containerDom.clientWidth - 20
    const windowH = containerDom.clientHeight - 20
    graph = iStorylineInstance.scale(10, 10, windowW * 0.8, windowH / 2)
    logStoryInfo(iStorylineInstance._story)
    const storylines = graph.storylines
    const characters = graph.characters
    storylines.forEach((storyline, idx) =>
      drawStoryline(characters[idx], storyline)
    )
  }
  main('JurassicParkTune.json')
  return (
    <div>
      Spatial-Temporal Storyline Visualization
      <pre></pre>
    </div>
  )
}

// fetch("https://api.example.com/items")
//       .then(res => res.json())
//       .then(
//         (result) => {
//           this.setState({
//             isLoaded: true,
//             items: result.items
//           });
//         },
//         // Note: it's important to handle errors here
//         // instead of a catch() block so that we don't swallow
//         // exceptions from actual bugs in components.
//         (error) => {
//           this.setState({
//             isLoaded: true,
//             error
//           });
//         }
//       )
