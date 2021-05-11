import React, {useContext, useState, useRef} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/react-hooks'; 
import { Button, Card, Dimmer, Loader, Form, Grid, Image, Icon, Label, Transition } from 'semantic-ui-react';
import moment from 'moment';


import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import PopUp from '../utilities/PopUp';


function UserPost(props) {
    const postId = props.match.params.postId;

    const { user } = useContext(AuthContext);

    const [comment, setComment] = useState('');

    const commentInputRef = useRef(null);

    const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
        variables: {
            postId
        }
    });

    const [createComment] = useMutation(CREATE_COMMENT_MUTATION, {
        update(){
            setComment('');
            commentInputRef.current.blur();
        },
        
        variables: {
            postId,
            body: comment
        }
    });

    function deletePostCallBack(){
        props.history.push('/');
    }

    let postMarkup;
    if(!getPost){
        postMarkup = 
            <Dimmer active inverted>
                <Loader size='medium'>Loading Post</Loader>
            </Dimmer>
    }
    else{
        const { id, body, createdAt, username, likes, likeCount, comments, commentCount } = getPost;

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image 
                            src='https://react.semantic-ui.com/images/avatar/large/jenny.jpg'
                            size="small"
                            float="right"
                        />
                    </Grid.Column>

                    <Grid.Column width={10}> 
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{ username }</Card.Header>
                                <Card.Meta>{ moment(createdAt).fromNow(true) }</Card.Meta>
                                <Card.Description>{ body }</Card.Description>
                            </Card.Content>
                            <hr />
                            <Card.Content extra>
                                <LikeButton user={user} post={{likes, id, likeCount}} />

                                <PopUp content="Add Comment">
                                    <Button 
                                        as="div"
                                        labelPosition="right"
                                        onClick={() => console.log("commented")}
                                    >
                                        <Button basic color='blue'>
                                            <Icon name="comments" />
                                        </Button>
                                        <Label basic color='blue' pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                </PopUp>
                                
                                    
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallBack}/>
                                )}

                            </Card.Content>
                        </Card>
                        
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    {/* <p style={{textAlign: 'center'}}>Post a Comment:</p> */}
                                    <Form>
                                        <div class="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="your comment.."
                                                name="comment"
                                                value={comment}
                                                onChange= {(event) => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={createComment}
                                            >
                                                Post Comment
                                            </button> 
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        
                        <Transition.Group>
                            {comments.map((comment) => (
                                <Card fluid key={comment.id}>
                                    <Card.Content>
                                        {user && user.username === comment.username && (
                                            <DeleteButton postId={id} commentId={comment.id} />
                                        )}
                                        <Card.Header>{comment.username}</Card.Header>
                                        <Card.Meta>{moment(comment.createdAt).fromNow(false)}</Card.Meta>
                                        <Card.Description>{comment.body}</Card.Description>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Transition.Group>

                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    
    return postMarkup;
}

const CREATE_COMMENT_MUTATION = gql`
    mutation($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body){
            id
            comments{
                id
                body
                createdAt
                username
            }
            commentCount
        }
    }
`

const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId){
            id body createdAt username
            likeCount
            likes{
                username
            }
            commentCount
            comments{
                id
                username
                createdAt
                body
            }
        }
    }
`;

export default UserPost;