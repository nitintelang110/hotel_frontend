import {React,useState} from 'react'
import moment from 'moment'
import styles from './Clock.module.css'


export const Clock = () => {

    const timer = moment().format('LTS')
    const day = moment().format('dddd'); 
    const date = moment().format('LL'); 

    const [time,setTime]=useState(timer)

 const updateTime=()=>{
    let digitime =  moment().format('LTS')
    setTime(digitime)
 }
   
setInterval(updateTime,1000)



  return (
    <div className={styles.container}>
 {date} {day} {time} 
    </div>
  )
}

