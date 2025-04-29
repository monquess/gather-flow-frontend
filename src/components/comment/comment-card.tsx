import { Comment } from '@/shared/types/comment'
import React from 'react'

interface CommentCardProps {
	comment: Comment
}

const CommentCard: React.FC<CommentCardProps> = ({ comment }) => {
	return <>{comment}</>
}

export default React.memo(CommentCard)
