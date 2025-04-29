import { forwardRef } from 'react'
import { CardProps, Card } from '@mantine/core'
import { motion } from 'framer-motion'

export const MotionCard = motion.create(
	forwardRef<HTMLDivElement, CardProps>((props, ref) => (
		<Card ref={ref} {...props} />
	))
)
