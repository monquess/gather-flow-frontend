export const cleanMarkdown = (md: string) =>
	md.replace(/(\|.*\|)\s*\n\s*\|/g, '$1\n|')

export const truncateText = (text: string, maxLength: number) => {
	if (!text) return ''
	return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}
