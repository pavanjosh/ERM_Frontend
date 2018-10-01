
import { API_STUB_ENDPOINTS } from './constants'
import { LOGIN_API_PATH } from "./constants";

export const StubAPI = endpoint => {

    const isStub= isStubEndpoint(endpoint)
    console.info(isStub)

    if(!isStub)
        return null
    
    if(endpoint == LOGIN_API_PATH)
        return mockLogin()

}

const mockLogin = () => {
    return {
      status : 200,
      success : true,
      data:{  
        token: "eyJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6IjEiLCJuYmYiOjE1MzgzNTQxNDMsInRpbWV6b25lIjoiUGFjaWZpYy9BdWNrbGFuZCIsImlzcyI6IkVSTSIsImxvY2FsZSI6ImVuX05aIn0.tEcJGHtxHPUeS1Uonl4_FHLvLoPYvFewgdRUiQs_3dA", 
        roles: [ "Admin", "Supervisor" ] 
      }
    }
  }

const isStubEndpoint = url => {
    let status = false
    API_STUB_ENDPOINTS.map((_stub, i) => {
        console.info(url)
        console.info(_stub)
        console.info(_stub == url)
        if(_stub == url)
            status= true
    })
    return status
}