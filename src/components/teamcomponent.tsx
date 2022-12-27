import React from 'react'

type Props = { name: string}

function teamcomponent({ name }: Props) {
    return (
        <div className={name}><input className='points' type="text" /></div>
    )
}

export default teamcomponent