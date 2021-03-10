import React from 'react'
import {shallow} from 'enzyme'
import AppConfig from './index.jsx'
import CommerceAPI from '../../commerce-api'

describe('AppConfig', () => {
    test('renders', () => {
        const wrapper = shallow(<AppConfig />)

        expect(wrapper).toBeDefined()
    })

    test('AppConfig static methods behave as expected', () => {
        expect(AppConfig.restore()).toBe(undefined)
        expect(AppConfig.restore({frozen: 'any values here'})).toBe(undefined)
        expect(AppConfig.freeze()).toBe(undefined)
        expect(AppConfig.extraGetPropsArgs()).toEqual(
            expect.objectContaining({
                api: expect.any(CommerceAPI)
            })
        )
    })
})
