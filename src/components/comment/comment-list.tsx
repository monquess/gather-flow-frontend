import React from 'react'

interface CommentListProps {
	comments: Comment[]
}

const CommentList: React.FC<CommentListProps> = ({ comments }) => {
	return <>{comments}</>
}

export default React.memo(CommentList)
