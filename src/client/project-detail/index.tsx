import React from 'react';
import { List, Button, Upload } from 'antd';
import  fs from 'fs';
import { connect, Dispatch } from 'react-redux'
import commandRegistry from '../emitter'
import * as types from '../types'
// import ProjectDetailManager from '../project/projectdetailViewM'
// import { app } from 'electron'

class Home extends React.PureComponent<any, any> {
    constructor(props: any){
        super(props);
    }
    componentDidMount() {
        // this.getLocalData();
    }
    render() {
        return(
            <div>
               djfkslfjksl
            </div>
        )
    }
}

const mapStateToProps = (state: any, ownProps:any) => ({
    loacalData: state.loacalData,
    names: Object.keys(state.loacalData),
    paths: Object.values(state.loacalData),
})
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        dispatch
    }
}
const mergeProps = (stateProps:any, dispatchProps:any, ownProps:any) => {
    return { ...stateProps, ...dispatchProps, path:ownProps.path }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)