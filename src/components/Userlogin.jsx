import React from 'react'
import styles from './Userlogin.module.css'

export const Userlogin = () => {
  return (
    <div className={styles.main_container}>

<div className={styles.box}>
    <div className={styles.form}>
            <h2>Sign In</h2>
        <div className={styles.inputBox}><input type="text" required="required"/><span>Username</span>
                <i></i></div>
        <div className={styles.inputBox}><input type="text" required="required"/><span>Password</span>
                <i></i></div>
        <div className={styles.links}>
                <a href="#">Forgot Password</a>
            <a className={styles.signup} href="#">Signup</a>
            </div>
            <input type="submit" value="Login" />
        </div>
        </div>

    </div>
  )
}

