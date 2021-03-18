import React, {useState} from 'react'

const GiftCheckbox = () => {
    const [checked, setChecked] = useState(false);
    const handleCheckbox = (event) => {
        event.preventDefault()
        setChecked(!checked);
    }
    return (
        <div>
            <input
                onChange={handleCheckbox}
                type="checkbox"
                id="giftMessage"
                name="giftMessage"
                defaultChecked="boxChecked"
            />
            <label htmlFor="giftMessage">gift message</label>
            {checked && (
                <textarea
                    id="giftText"
                    name="gifText"
                    rows="4"
                    cols="50"
                    placeholder="Please enter a gift message here"
                />
            )}
        </div>
    )
}

export default GiftCheckbox
