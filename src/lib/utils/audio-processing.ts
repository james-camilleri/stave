import type { Point, VoiceGroupData } from '$lib/types'

export function generateBarWarpPoints(
  voiceData: VoiceGroupData[],
  boundingBox: { startX: number; endX: number; startY: number; endY: number },
  offsetHeight: number
): Point[][] {
  const { leastActiveTime, greatestActiveTime, maxFrequencyRange } = voiceData.reduce(
    (mergedData, voiceGroup) => {
      if (voiceGroup.activeTime > mergedData.greatestActiveTime) {
        mergedData.greatestActiveTime = voiceGroup.activeTime
      }

      if (voiceGroup.activeTime < mergedData.leastActiveTime) {
        mergedData.leastActiveTime = voiceGroup.activeTime
      }

      const voiceGroupRange = voiceGroup.highestFrequency - voiceGroup.lowestFrequency
      if (voiceGroupRange > mergedData.maxFrequencyRange) {
        mergedData.maxFrequencyRange = voiceGroupRange
      }

      return mergedData
    },
    { leastActiveTime: Number.POSITIVE_INFINITY, greatestActiveTime: 0, maxFrequencyRange: 0 }
  )

  const trackerBars = voiceData.map((voiceGroup) => ({
    height: (voiceGroup.highestFrequency - voiceGroup.lowestFrequency) / maxFrequencyRange,
    position: (voiceGroup.activeTime - leastActiveTime) / (greatestActiveTime - leastActiveTime),
  }))

  // Sort bars for the most balanced image - shortest, largest, second-shortest, second-largest.
  const sortedTrackerBars = trackerBars.sort((barA, barB) => barB.height - barA.height)
  const positionedTrackerBars = [sortedTrackerBars[3], sortedTrackerBars[0], sortedTrackerBars[2], sortedTrackerBars[1]]

  const { startX, endX, startY, endY } = boundingBox
  const spaceBetweenBars = (endY - startY) / 4

  const trackerBarPadding = (endX - startX) / 5
  const trackerBarStart = startX + trackerBarPadding
  const trackerBarEnd = endX - trackerBarPadding

  return positionedTrackerBars.map((bar, i) => [
    {
      x: trackerBarStart + (trackerBarEnd - trackerBarStart) * bar.position,
      y: startY + spaceBetweenBars / 2 + spaceBetweenBars * i - (offsetHeight * bar.height) / 2,
    },
    {
      x: trackerBarStart + (trackerBarEnd - trackerBarStart) * bar.position,
      y: startY + spaceBetweenBars / 2 + spaceBetweenBars * i + (offsetHeight * bar.height) / 2,
    },
  ])
}

export function groupBandPoints(startPoints: Point[], offsetPoints: Point[][], endPoints: Point[]) {
  const bands: Point[][] = []

  for (let i = 0; i < startPoints.length - 1; i++) {
    const band = [startPoints[i]]

    if (i === 0) {
      // Push top point twice in case of first bar.
      band.push(offsetPoints[i][0], offsetPoints[i][0])
    } else {
      band.push(...[offsetPoints[i - 1][1], offsetPoints[i][0]].sort((pointA, pointB) => pointA.x - pointB.x))
    }

    band.push(endPoints[i])
    band.push(endPoints[i + 1])

    if (i === startPoints.length - 2) {
      // Push bottom point twice in case of last bar.
      band.push(offsetPoints[i][1], offsetPoints[i][1])
    } else {
      band.push(...[offsetPoints[i][1], offsetPoints[i + 1][0]].sort((pointA, pointB) => pointB.x - pointA.x))
    }

    band.push(startPoints[i + 1])

    bands.push(band)
  }

  return bands
}

// groupedTrackingPoints.push(trackingPoints.splice(0, elementsToPush).sort((pointA, pointB) => pointA.x - pointB.x))
