import React from 'react';
import { List, Button, Upload } from 'antd';
import  fs from 'fs';
import { connect, Dispatch } from 'react-redux'

interface IProps {
    dispatch: any;
}

interface IHomeState{
    name: any[],
    path: any[],
}
class Home extends React.Component<IProps, IHomeState> {
    constructor(props: any){
        super(props);
        this.state = {
            name:[],
            path: []
        }
    }
    componentDidMount() {
        // fs.readFile('2.txt',function(error,data){
        //     if(error) {
        //         fs.mkdir('2.txt',function(error){
        //             if(error){
        //                 console.log(error);
        //                 return false;
        //             }
        //             console.log('创建目录成功');
        //         })
        //     };
        //     const res = JSON.parse(data.toString())
        //     console.log(res)
        // })
        this.getLocalData();
    }
    getLocalData = () => {
        this.props.dispatch({ type:'LOAD_FILE' })
    }
    addProject = (data) => {
        const {  path } = this.state
        const name = [];
        const currentPath = data.file.originFileObj.path;
        const currentName = data.file.name
        name.push(currentName);
        path.push(currentPath);
        this.setState({name, path})
        const str = {}
        name.map((item, index)=>{
            str[item] = path[index]
        })
        fs.writeFile("2.txt", JSON.stringify(str) , function(err){
            if(err) {
              return console.log("写入文件失败", err);
            }
            console.log("写入文件成功");
          })
    }
    renderHeader = () => {
        return <div>
            {/* <input type="file"/> */}
            <Upload onChange={this.addProject}>
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
                    dataSource={this.state.name ? this.state.name : []}
                    renderItem={item => (
                        <List.Item>
                            {item}
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}

const mapStateToProps = (state: any, ownProps:any) => ({ localdata: {} })
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        dispatch,
    }
}
const mergeProps = (stateProps:any, dispatchProps:any, ownProps:any) => {
    return { ...stateProps, ...dispatchProps, path:ownProps.path }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)