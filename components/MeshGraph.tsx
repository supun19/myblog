'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  label?: string
}

const SKILLS = [
  'AWS',
  'Serverless',
  'Node.js',
  'Jitsi',
  'React',
  'Next.js',
  'TypeScript',
  'Docker',
  'CDK',
  'Glue',
  'NestJS',
]

export default function MeshGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let nodes: Node[] = []
    let width = 0
    let height = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initNodes()
    }

    const initNodes = () => {
      nodes = []
      const numNodes = Math.floor((width * height) / 45000) // Reduced density (was 25000)

      // Add skill nodes
      SKILLS.forEach((skill) => {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          label: skill,
        })
      })

      // Add extra filler nodes
      for (let i = nodes.length; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Update positions
      nodes.forEach((node) => {
        node.x += node.vx
        node.y += node.vy

        // Bounce off walls
        if (node.x < 0 || node.x > width) node.vx *= -1
        if (node.y < 0 || node.y > height) node.vy *= -1
      })

      // Draw connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 200) {
            // Increased connection distance (was 150)
            const opacity = 1 - distance / 150
            ctx.strokeStyle = `rgba(100, 100, 100, ${opacity * 0.5})`
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw nodes
      nodes.forEach((node) => {
        ctx.fillStyle = node.label ? '#ec4899' : '#6b7280' // Pink for skills, gray for dots
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.label ? 4 : 2, 0, Math.PI * 2)
        ctx.fill()

        if (node.label) {
          ctx.fillStyle = document.documentElement.classList.contains('dark')
            ? '#e5e7eb'
            : '#1f2937'
          ctx.font = '12px sans-serif'
          ctx.fillText(node.label, node.x + 8, node.y + 4)
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    resize()
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 h-full w-full bg-white transition-colors duration-300 dark:bg-gray-950"
    />
  )
}
