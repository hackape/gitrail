import React from 'react';
import { List, Button, Upload } from 'antd';
import  fs from 'fs';
import { connect, Dispatch } from 'react-redux'
import commandRegistry from '../emitter'
import * as types from '../types'

class Home extends React.PureComponent<any, any> {
    constructor(props: any){
        super(props);
    }
    componentDidMount() {
        this.getLocalData();
    }
    getLocalData = () => {
        commandRegistry.emit(types.LOAD_FILE); 
    }
    addProject = (data) => {
        const { paths, names } = this.props;
        const currentPath = data.file.originFileObj.path;
        const currentName = data.file.name
        names.push(currentName);
        paths.push(currentPath);
        const str = {}
        names.map((item, index)=>{
            str[item] = paths[index]
        })
        commandRegistry.emit(types.ADD_FILE, str);
    }
    handleClick=(item) => {
        console.log(this.props.loacalData[item.target.innerHTML])
    }
    renderHeader = () => {
        return <div>
            {/* <input type="file"/> */}
            <Upload onChange={this.addProject} showUploadList={false}>
                <Button>添加项目</Button>
            </Upload>
        </div>
    }
    render() {
        return(
            <div>
                <List
                    header={this.renderHeader()}
                    bordered
                    dataSource={this.props.names ? this.props.names : []}
                    renderItem={(item, index) => (
                        <List.Item onClick={this.handleClick}>
                            {item}
                        </List.Item>
                    )}
                />
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