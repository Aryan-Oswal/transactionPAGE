import React from 'react'
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import db from '../config'
import firebase from 'firebase'

export default class Transaction extends React.Component {
    constructor() {
        super()
        this.state = {
            hasCameraPermission: null,
            scan: false,
            scanedData: '',
            buttonState: 'normal',
            scanedBookId: '',
            scanedStudentId: '',
            id: '',
            data: {},

        }
    }

    getPermission = async(id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermission: status === 'granted',
            buttonState: id,
            scan: false
        })

        console.log(this.state.buttonState)
    }

    handlebarCodeScan = async({type , data}) => {
        const {buttonState} = this.state
        console.log(buttonState)
        if(buttonState === 'bookId') {
            this.setState({
                scan: true,
                scanedBookId: data,
                id: data,
                buttonState: 'normal'
            })

        }
        if(buttonState === 'studentId') {
            this.setState({
                scan: true,
                scanedStudentId: data,
                buttonState: 'normal'
            })
        }
        
    }
    intiateBookIssue =  async () => {
        db.collection('transaction').add({
            bookId: this.state.scanedBookId,
            studentId: this.state.scanedStudentId,
            data: firebase.firestore.Timestamp.now().toDate(),
            type: 'issue'
        })

        db.collection('Books').doc(this.state.scanedBookId).update({avability: false})
        db.collection('Student').doc(this.state.scanedStudentId).update({books: firebase.firestore.FieldValue.increment(1)})
        this.setState({
            scanedStudentId: '',
            scanedBookId: '',
        })
    }
    intiateBookReturn = async () => {
        db.collection('transaction').add({
            bookId: this.state.scanedBookId,
            studentId: this.state.scanedStudentId,
            data: firebase.firestore.Timestamp.now().toDate(),
            type: 'return'
        })
        db.collection('Books').doc(this.state.scanedBookId).update({avability: true})
        db.collection('Student').doc(this.state.scanedStudentId).update({books: firebase.firestore.FieldValue.increment(-1)})
        this.setState({
            scanedStudentId: '',
            scanedBookId: '',
        })
    }
    handleSubmit = () => {
        var book;
        db.collection('Books').doc(this.state.scanedBookId).get().then((doc) => {
            console.log('hi' , doc.data())
            book = doc.data()
           
            if(book.avability) {
                this.intiateBookIssue()
            }else {
                this.intiateBookReturn()
            }
        })

    }
    render() {
        const hasCameraPermission = this.state.hasCameraPermission
        const buttonState = this.state.buttonState
        const scan = this.state.scan

        if(buttonState !== 'normal' && hasCameraPermission) {
            return (
                <BarCodeScanner style={StyleSheet.absoluteFillObject} onBarCodeScanned={scan ? undefined : this.handlebarCodeScan} />

            )
        }else if(buttonState === 'normal') {
            return (
            <View>


                <TouchableOpacity onPress={this.getPermission} style={styles.opacity}><Text style={styles.text}>Scan QR Code</Text></TouchableOpacity>
                <Text>{hasCameraPermission === true ? this.state.scanedData : 'Request Camera Permision'}</Text>
                <View style={styles.flex}>
                    <Image source={require('../assets/booklogo.jpg')} style={{width: 100 , height: 100  }} />
                    <View  style={styles.view}>
                        <TextInput value={this.state.scanedBookId} placeholder="Book ID" style={styles.input} /><TouchableOpacity onPress={() => this.getPermission('bookId')} style={styles.opacity2}><Text>Scan</Text></TouchableOpacity>
                    </View>
                    <View style={styles.view}>
                        <TextInput value={this.state.scanedStudentId} placeholder="Student ID" style={styles.input} /><TouchableOpacity onPress={() => this.getPermission('studentId')} style={styles.opacity2}><Text>Scan</Text></TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => this.handleSubmit()}><Text>Submit</Text></TouchableOpacity>
                </View>

            </View>
        )
        }


        
    }
    
}


const styles= StyleSheet.create({
    opacity: {
        backgroundColor: 'cyan',
        alignItems: 'center',
        justifyContent: 'center',
    },

    opacity2: {
        width: 90,
        marginBottom: 20,
        height: '100%',
    },
    view: {
        display: 'flex',
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-evenly'
    },
     input:{
        width: '100%'
     }
     ,
     flex: {
         display: 'flex',
         alignItems: 'center'
     }
})