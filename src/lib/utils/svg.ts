import type { Point } from '../types'

export function pointToString(point: Point) {
  return `${point.x},${point.y}`
}

export function pointsToString(points: Point[]) {
  return points.map(pointToString).join(' ')
}

export function pointsToPath(points: Point[]) {
  return `M${points.map(pointToString).join(' L')}`
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

export function degreesToRadians(degrees: number) {
  return (degrees * Math.PI) / 180
}

export function translate(x: number, y: number) {
  return `translate(${x}px, ${y}px)`
}

export function translatePoint(point: Point, vector: Point) {
  return {
    x: point.x + vector.x,
    y: point.y + vector.y,
  }
}

export function rotate(amount: number, point?: Point) {
  if (!point) {
    point = { x: 0, y: 0 }
  }

  return `translate(${point.x}px, ${point.y}px) rotate(${amount}deg) translate(-${point.x}px, -${point.y}px)`
}

export function rotatePoint(point: Point, origin: Point, angle: number) {
  const angleInRadians = degreesToRadians(angle)
  const sin = Math.sin(angleInRadians)
  const cos = Math.cos(angleInRadians)

  // Translate point to origin
  const xTranslated = point.x - origin.x
  const yTranslated = point.y - origin.y

  // Rotate
  const xRotated = xTranslated * cos - yTranslated * sin
  const yRotated = xTranslated * sin + yTranslated * cos

  // Translate back and return
  return {
    x: xRotated + origin.x,
    y: yRotated + origin.y,
  }
}

export function midpoint(pointA: Point, pointB: Point) {
  return {
    x: pointA.x + (pointB.x - pointA.x) / 2,
    y: pointA.y + (pointB.y - pointA.y) / 2,
  }
}

export function square(midpoint: Point, width: number, height: number) {
  return [
    { x: midpoint.x - width / 2, y: midpoint.y - height / 2 },
    { x: midpoint.x + width / 2, y: midpoint.y - height / 2 },
    { x: midpoint.x + width / 2, y: midpoint.y + height / 2 },
    { x: midpoint.x - width / 2, y: midpoint.y + height / 2 },
    { x: midpoint.x - width / 2, y: midpoint.y - height / 2 },
  ]
}

export function triangle(midpoint: Point, height: number) {
  const centreToPoint = -height / 3
  return [
    translatePoint(midpoint, { x: 0, y: centreToPoint }),
    rotatePoint(translatePoint(midpoint, { x: 0, y: centreToPoint }), midpoint, 120),
    rotatePoint(translatePoint(midpoint, { x: 0, y: centreToPoint }), midpoint, 240),
    translatePoint(midpoint, { x: 0, y: centreToPoint }),
  ]
}
