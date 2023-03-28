import type { Point } from '../types'

export function pointToString(point: Point) {
  return `${point.x},${point.y}`
}

export function pointsToString(points: Point[]) {
  return points.map(pointToString).join(' ')
}

export function subdivide(points: Point[], noOfSubdivisions: number): Point[]
export function subdivide(points: Point[][], noOfSubdivisions: number): Point[][]
export function subdivide(points: Point[] | Point[][], noOfSubdivisions: number): Point[] | Point[][] {
  if (isDeepList(points)) {
    return points.map((points) => subdivide(points, noOfSubdivisions))
  }

  if (points.length === 1) {
    throw Error('A minimum of two points are needed to create subdivisions')
  }

  const newPoints: Point[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const startPoint = points[i]
    const targetPoint = points[i + 1]
    const changeX = (targetPoint.x - startPoint.x) / (noOfSubdivisions + 1)
    const changeY = (targetPoint.y - startPoint.y) / (noOfSubdivisions + 1)

    newPoints.push(startPoint)
    for (let j = 0; j < noOfSubdivisions; j++) {
      newPoints.push({
        x: startPoint.x + changeX * (j + 1),
        y: startPoint.y + changeY * (j + 1),
      })
    }
  }

  newPoints.push(points[points.length - 1])

  return newPoints
}

function isDeepList(points: Point[] | Point[][]): points is Point[][] {
  return Array.isArray(points[0])
}
