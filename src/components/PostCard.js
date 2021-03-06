import React, { useContext } from 'react';
import { Card, Icon, Label, Image, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { AuthContext } from '../context/auth';
import PopUp from '../utilities/PopUp';

import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';

function PostCard({ post: {id, username, body, likeCount, commentCount, likes, comments, createdAt} }){
    
    const { user } = useContext(AuthContext);
    
    return (
        <Card fluid>
            <Card.Content>
                <Image
                floated='right'
                size='mini'
                src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                />
                <Card.Header>{ username }</Card.Header>
                <Card.Meta as={ Link } to={ `/posts/${id}` }>{ moment(createdAt).fromNow(true) }</Card.Meta>
                <Card.Description>{ body }</Card.Description>
            </Card.Content>
            <Card.Content extra>
                
                <LikeButton user={user} post={{likes, id, likeCount}}/>

                {/* comment buutton */}
                <PopUp content='Add Comment' >
                    <Button labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='teal' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='teal' pointing='left'>{ commentCount }</Label>
                    </Button>
                </PopUp>

                {/* delete button*/}
                {user && user.username === username &&
                    <DeleteButton postId={id}/>
                }
            </Card.Content>
        </Card>
    )
}

export default PostCard;