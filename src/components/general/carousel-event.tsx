import { useResponsive } from '@/hooks/use-responsive'
import classes from '@/shared/styles/slider.module.css'
import { EventItem } from '@/shared/types/events'
import { Carousel } from '@mantine/carousel'
import { Box, Flex, Text } from '@mantine/core'
import Autoplay from 'embla-carousel-autoplay'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import EventCard from '../event/event-card'

interface CarouselEventProps {
	events: EventItem[] | undefined
	delay: number
}
const CarouselEvent: React.FC<CarouselEventProps> = ({ events, delay }) => {
	const { isMobile } = useResponsive()
	const { t } = useTranslation()
	const autoplay = useRef(Autoplay({ delay: delay }))

	if (!Array.isArray(events) || events.length === 0) {
		return <Text>{t('carousel.noEvent')}</Text>
	}

	return (
		<>
			{events && (events?.length > 3 || isMobile) ? (
				<Carousel
					slideSize={isMobile ? '100%' : '33.333333%'}
					slideGap="md"
					loop
					withControls
					align="start"
					draggable
					plugins={[autoplay.current]}
					onMouseEnter={() => autoplay.current.stop()}
					onMouseLeave={() => autoplay.current.play()}
					classNames={classes}
				>
					{events?.map((event) => (
						<Carousel.Slide key={event.id}>
							<EventCard event={event} />
						</Carousel.Slide>
					))}
				</Carousel>
			) : (
				<Flex gap="md" direction="row" wrap="nowrap">
					{events?.map((event) => (
						<Box key={event.id} style={{ flex: '0 0 32.6%' }}>
							<EventCard event={event} />
						</Box>
					))}
				</Flex>
			)}
		</>
	)
}

export default React.memo(CarouselEvent)
