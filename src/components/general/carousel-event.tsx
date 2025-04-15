import classes from '@/shared/styles/slider.module.css'
import { EventItem } from '@/shared/types/events'
import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import React, { useRef } from 'react'
import EventCard from '../event/event-card'

interface CarouselEventProps {
	events: EventItem[] | undefined
}
const CarouselEvent: React.FC<CarouselEventProps> = ({ events }) => {
	const autoplay = useRef(Autoplay({ delay: 2000 }))
	return (
		<Carousel
			slideSize="100%"
			slideGap="md"
			loop
			withControls
			align="start"
			draggable
			plugins={[autoplay.current]}
			onMouseEnter={autoplay.current.stop}
			onMouseLeave={autoplay.current.reset}
			classNames={classes}
		>
			{events?.map((event) => (
				<Carousel.Slide key={event.id}>
					<EventCard event={event} />
				</Carousel.Slide>
			))}
		</Carousel>
	)
}

export default React.memo(CarouselEvent)
