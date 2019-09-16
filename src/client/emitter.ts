import  events from 'events';
import store from './store';
import  fs from 'fs';
import { loadFile, addFile } from './action';
import * as types from './types'

const commandRegistry = new events.EventEmitter();

commandRegistry.on(types.LOAD_FILE, ()=> {
    let res;
    fs.readFile('2.txt',function(error,data){
        if(error) {
            fs.mkdir('2.txt',function(error){
                if(error){
                    console.log(error);
                    return false;
                }
                console.log('创建目录成功');
            })
        };
        res = JSON.parse(data.toString())
        store.dispatch(loadFile({loacalData: res}));
    })
})

commandRegistry.on(types.ADD_FILE, (str)=> {
    fs.writeFile("2.txt", JSON.stringify(str) , function(err){
        if(err) {
          return console.log("写入文件失败", err);
        }
        console.log("写入文件成功");
      });
        store.dispatch(addFile({loacalData: str}));
    })

export default commandRegistry;