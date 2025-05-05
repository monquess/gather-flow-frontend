import { ActionIcon, Group, Stack, Title, Tooltip } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useTranslation } from 'react-i18next'
import { FaLink } from 'react-icons/fa'
import {
	FaFacebookF,
	FaShare,
	FaTelegram,
	FaWhatsapp,
	FaXTwitter,
} from 'react-icons/fa6'
import {
	FacebookShareButton,
	TelegramShareButton,
	TwitterShareButton,
	WhatsappShareButton,
} from 'react-share'

interface SocialShareButtonsProps {
	url: string
	title?: string
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
	url,
	title,
}) => {
	const iconSize = 20
	const { t } = useTranslation()

	return (
		<Stack gap="xs">
			<Group gap="0.5rem">
				<FaShare />
				<Title order={6}>{t('common.shareTitle')}</Title>
			</Group>
			<Group gap="xs">
				<Tooltip label="X (Twitter)" withArrow>
					<ActionIcon variant="light" radius="xl" size="lg">
						<TwitterShareButton url={url} title={title}>
							<FaXTwitter size={iconSize} />
						</TwitterShareButton>
					</ActionIcon>
				</Tooltip>

				<Tooltip label="Telegram" withArrow>
					<ActionIcon variant="light" radius="xl" size="lg">
						<TelegramShareButton url={url} title={title}>
							<FaTelegram size={iconSize} />
						</TelegramShareButton>
					</ActionIcon>
				</Tooltip>

				<Tooltip label="Facebook" withArrow>
					<ActionIcon variant="light" radius="xl" size="lg">
						<FacebookShareButton url={url} title={title}>
							<FaFacebookF size={iconSize} />
						</FacebookShareButton>
					</ActionIcon>
				</Tooltip>

				<Tooltip label="WhatsApp" withArrow>
					<ActionIcon variant="light" radius="xl" size="lg">
						<WhatsappShareButton url={url} title={title}>
							<FaWhatsapp size={iconSize} />
						</WhatsappShareButton>
					</ActionIcon>
				</Tooltip>

				<Tooltip label={t('common.copyLink')} withArrow>
					<ActionIcon
						variant="light"
						radius="xl"
						size="lg"
						onClick={() => {
							navigator.clipboard.writeText(url)
							notifications.show({
								color: 'white',
								message: t('common.linkToCB'),
								autoClose: 2000,
								position: 'bottom-center',
							})
						}}
					>
						<FaLink size={22} />
					</ActionIcon>
				</Tooltip>
			</Group>
		</Stack>
	)
}

export default SocialShareButtons
