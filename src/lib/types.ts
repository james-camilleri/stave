export interface Point {
  x: number
  y: number
}

export interface Circle {
  centre: Point
  radius: number
}

export interface VoiceGroupData {
  type: 'bass' | 'tenor' | 'alto' | 'soprano'
  highestFrequency: number
  lowestFrequency: number
  activeTime: number
  uniqueNotes: Set<string>
}

export interface TrackingBar {
  height: number
  position: number
}
