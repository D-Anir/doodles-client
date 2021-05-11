import React, {useEffect, useState} from 'react'
import { Link } from 'react-router-dom';
import {useMutation} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { Button, Label, Icon } from 'semantic-ui-react';

import PopUp from '../utilities/PopUp';

function LikeButton({user, post: {likes, id, likeCount}}) {
    const [liked, setLiked] = useState(false);
    
    useEffect(() => {
        if(user && likes.find((like) => like.username === user.username)){
            setLiked(true);
        }
        else{
            setLiked(false);
        }
    }, [user, likes]);
    

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: { postId: id }
    });


    const likeButton = user ? (
        liked ? (
            <Button color='teal'>
                <Icon name='heart' />
            </Button>
        ) : (
            <Button color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    ) : (
            <Button color='teal' basic as={Link} to="/login">
                <Icon name='heart' />
            </Button>
    );

    return (

        user? (
            <Button as='div' labelPosition='right' onClick={likePost}>
                <PopUp content={liked? 'unlike post': 'like post'}>
                {likeButton} 
                </PopUp>
                <Label basic color='teal' pointing='left'>{ likeCount }</Label>
            </Button>
        ):(
            <Button labelPosition='right' as='a' href='/login'>
                <PopUp content={liked? 'unlike post': 'like post'}>
                {likeButton} 
                </PopUp>
                <Label basic color='teal' pointing='left'>{ likeCount }</Label>
            </Button>
        )
    );
}

const LIKE_POST_MUTATION = gql`
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id
                username
            }
            likeCount
        }
    }
`;

export default LikeButton;
