import React, {useState} from 'react';
import gql from 'graphql-tag';
import {useMutation} from '@apollo/react-hooks';
import { Button, Confirm, Icon } from 'semantic-ui-react';

import { FETCH_POSTS_QUERY } from '../utilities/graphql';
import PopUp from '../utilities/PopUp';


function DeleteButton({ postId, commentId, callback }) {
    const [confirmAppear, setConfirmAppear] = useState(false);

    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION ;

    const [deletePostOrMutation] = useMutation(mutation, {
        update(proxy){
            setConfirmAppear(false);
            // remove post from database
            if(!commentId){
                const data = proxy.readQuery({
                    query: FETCH_POSTS_QUERY
                })
    
                proxy.writeQuery({
                    query: FETCH_POSTS_QUERY,
                    data: {
                      getPosts: data.getPosts.filter((p) => p.id !== postId),
                    },
                })
            }
            if(callback){
                callback();
            }
        },
        variables: {
            postId,
            commentId
        }
    })
    
    return (
        <>
            <PopUp content= {commentId ? "Delete Comment" : "Delete Post"}>
                <Button as='div' color="red" onClick={() => setConfirmAppear(true)} floated='right'>
                    <Icon name='trash alternate' style={{ margin: 0}}/>
                </Button>
            </PopUp>
            <Confirm open={confirmAppear} onCancel={() => setConfirmAppear(false)} onConfirm={deletePostOrMutation} />

        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId)
    }
`

const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId){
            id
            comments{
                id
                username
                body
                createdAt
            }
            commentCount
        }
    }
`

export default DeleteButton;