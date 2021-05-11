import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { useForm } from '../utilities/hooks';
 
import { FETCH_POSTS_QUERY } from '../utilities/graphql';

function PostForm(){
    
    const {values, onChange, onSubmit} = useForm(createPostCallBack, {
        body: ''
    });

    const [ createPost, { error } ] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        // update(proxy, result){
        //     const data = proxy.readQuery({
        //         query: FETCH_POSTS_QUERY
        //     }); 
        //     data.getPosts = [result.data.createPost, ...data.getPosts];
        //     proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
        //     values.body = ''
        // }
        update(proxy, result) {
            const data = proxy.readQuery({
              query: FETCH_POSTS_QUERY
            })

            proxy.writeQuery({
              query: FETCH_POSTS_QUERY,
              data: {
                getPosts: [
                  result.data.createPost,
                  ...data.getPosts,
                ],
              },
            })
    
            values.body = ''
        },
    });

    function createPostCallBack(){
        createPost();
    }

    return(
        <>
            <Form onSubmit={onSubmit} >
                <h1>Create your doodle:</h1>
                <Form.Field>
                    <Form.Input
                        placeholder="happy doodling!"
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error ? true : false} 
                    />
                    <Button disabled={!values.body.trim()} color='teal' type='submit'>
                        Publish
                    </Button>
                </Form.Field>
            </Form>
            {error && (
                <div className="ui error message" style={{marginBottom: 20}}>
                    <ul className='list'>
                        <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                </div>
            )}
        </>
    );
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body){
            id body createdAt username
            likes{
                id username createdAt
            }
            likeCount
            comments{
                id body username createdAt
            }
            commentCount
        }
    }
`

export default PostForm;