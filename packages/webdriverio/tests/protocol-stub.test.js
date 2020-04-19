import ProtocolStub from '../src/protocol-stub'
import Multiremote from '../src/multiremote'

describe('reloadSession', () => {
    it('should throw', () => {
        expect(() => ProtocolStub.reloadSession()).toThrow()
    })
})

describe('newSession', () => {
    it('should add commands and flags', async () => {
        const session = await ProtocolStub.newSession({ capabilities: { 'appium:deviceName': 'Some Device', platformName: 'iOS', foo: 'bar' } })
        expect(Object.keys(session)).toHaveLength(8)
        expect(session.isAndroid).toBe(false)
        expect(session.isChromium).toBe(false)
        expect(session.isIOS).toBe(true)
        expect(session.isMobile).toBe(true)
        expect(session.isSauce).toBe(false)
        expect(session.capabilities).toEqual({ deviceName: 'Some Device', platformName: 'iOS', foo: 'bar' })
        expect(() => session.addCommand()).toThrow()
        expect(() => session.overwriteCommand()).toThrow()
    })

    it('should create stub for devtools automationProtocol', async () => {
        const session = await ProtocolStub.newSession({ capabilities: { browserName: 'chrome' }, _automationProtocol: 'devtools' })
        expect(Object.keys(session)).toHaveLength(11)
        expect(session.isChromium).toBe(true)
        expect(session.isW3C).toBe(true)
        expect(session.isSeleniumStandalone).toBe(false)
    })
})

describe('attachToSession', () => {
    it('should return newSession if not multiremore', async () => {
        const modifier = jest.fn()
        const session = await ProtocolStub.attachToSession({ capabilities: { browserName: 'chrome' } }, modifier)
        expect(modifier).not.toBeCalled()
        expect(session.isChromium).toBe(true)
    })

    it('should return newSession if modifier was not passed', async () => {
        const session = await ProtocolStub.attachToSession()
        expect(session.capabilities).toEqual({})
    })

    it('should call modifier if multiremote', async () => {
        const multiremore = new Multiremote()
        multiremore.instances['instanceName'] = 'instance'

        const session = await ProtocolStub.attachToSession(undefined, ::multiremore.modifier)

        expect(session.capabilities).toBeUndefined()
        expect(session.commandList).toHaveLength(0)
        expect(session.instanceName).toBe('instance')
        expect(() => session.addCommand()).toThrow()
        expect(() => session.overwriteCommand()).toThrow()
    })
})
