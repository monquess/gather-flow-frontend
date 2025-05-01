import { Helmet } from 'react-helmet'
import { Event } from '@/shared/types'

interface EventMetaTagsProps {
	event: Event
}

export const EventMetaTags: React.FC<EventMetaTagsProps> = ({ event }) => {
	const url = `http://localhost:4200/events/${event.id}`

	return (
		<Helmet>
			<meta charSet="utf-8" />
			<meta property="og:title" content={event.title} />
			<meta property="og:image" content={event.poster} />
			<meta property="og:url" content={url} />
			<meta property="og:type" content="article" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:image" content={url} />

			<link rel="canonical" href={url} />
			<title>{event.title}</title>
		</Helmet>
	)
}
