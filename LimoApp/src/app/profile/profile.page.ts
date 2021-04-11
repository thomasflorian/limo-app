import { Component, OnInit } from '@angular/core';
import { MenuController, IonRouterOutlet } from '@ionic/angular';
import { File } from '@ionic-native/file';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  _name: string = "";
  _telNum: string = "";
  _nameOld: string = "";    //Keeps track of existing user info to prevent re-writing the same info
  _telNumOld: string = "";
  disabled: boolean = true;
  profileExists: boolean = true;  //CHANGE THIS TO FALSE BEFORE RELEASE (prevents users from exiting this screen if they have not made a profile before)

  get name() {
    return this._name;
  }

  set name(val) {
    this._name = val;
  }

  get telNum() {
    return this._telNum;
  }

  set telNum(val) {
    this._telNum = val;
  }

  constructor(private menu: MenuController, private routerOutlet: IonRouterOutlet) { }

  // Runs when menu bar icon is clicked.
  openMenu() {
    this.menu.enable(true, 'limomenu');
    this.menu.open('limomenu');
  }

  // Runs when page first loads.
  ngOnInit() {
    // Disables ability to swipe back to previous page.
    this.routerOutlet.swipeGesture = false;
    this.verifyProfile();
  }

  //Checks whether a profile exists
  verifyProfile() {
    File.checkFile(File.cacheDirectory, "ProfileInfo.txt")
    //For some reason, the "then" functions make the GUI for this page bug out. Even if there is nothing inside the "then" function, it still freaks out.
    //I think it's just an emulator thing, because the GUI goes back to normal if you mess with it enough
    //John and I will have to build the app to our phones and see if it's any better then
    //-----------------------------------------------------------------------------------------------------
    /*.then((val: boolean) => {
      //Will read the file if it exists
      if(val) {
        this.getProfileInfo();
      }
      //Will generate a new file if the file odes not exist
      else {
        this.generateFile();
      }
    }, (reason) => {
      throw new Error("Error locating profile information: " + reason);
    })
    //-----------------------------------------------------------------------------------------------------
    */;
  }

  getProfileInfo() {
    let fileContents : string[];
    File.readAsText(File.cacheDirectory, "ProfileInfo.txt")
    .then((contents: string) => {
      if(contents && (contents.indexOf(',') > -1)) {
        this.profileExists = true;
        fileContents = contents.split(',');  //Parses the name and the phone number from a single string
        this._name = fileContents[0].trim();
        this._telNum = fileContents[1].trim();
        this._nameOld = this._name;
        this._telNumOld = this._telNum
      }
    }, (reason) => {
      throw new Error("Error retrieving profile information: " + reason);
    });
  }

  generateFile() {
    File.createFile(File.cacheDirectory, "ProfileInfo.txt", false)
    .then(() => {
    }, (reason) => {
      throw new Error("Error generating profile storage: " + reason);
    });
  }

  save() {
    if(this._name.includes(',')) {
      throw new Error('Name cannot contain a comma (,)');
    }
    if(this._name.includes(',')) {
      throw new Error('Phone cannot contain a comma (,)');
    }
    let fileText : string = this._name + "," + this._telNum;
    File.writeExistingFile(File.cacheDirectory, "ProfileInfo.txt", fileText)
    .then(() => {
      this._nameOld = this._name;
      this._telNumOld = this._telNum;
      if(!this.profileExists) {
        this.profileExists = true;
        //Route to request page (idk how to do this)
      }
    }, (reason) => {
      throw new Error('Error saving profile information: ' + reason);
    });
  }

  changeImg() {
    //Add shit later
  }

  inputChange() {
    this.disabled = false;
    if(this._telNum && this._name && !(this._telNum === this._telNumOld && this._name === this._nameOld)) {    //If both inputs exist and the information is different from the existing profile
      this.disabled = false;
    }
    else {
      this.disabled = true;
    }
  }
}
