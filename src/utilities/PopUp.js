import {Popup} from 'semantic-ui-react';
import React from 'react'

function PopUp({content, children}) {
    return <Popup
                content={content}
                inverted
                trigger={children}
            />
}

export default PopUp;