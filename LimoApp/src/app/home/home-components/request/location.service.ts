import { ILocation } from '../../../shared/ILocation';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  locations : ILocation[] = [{
    "name": "The Commons",
    "address": "The Commons, 721 N 17th St, Milwaukee, WI 53233",
    "gps": [43.040119796976896, -87.93435173870222]
  },
  {
    "name": "Cudahy Hall",
    "address": "Katharine Reed Cudahy Hall, Milwaukee, WI 53233",
    "gps": [43.03831913359743, -87.92885918756656]
  },
  {
    "name": "Engineering Hall",
    "address": "Engineering Hall, 1637 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03851064297481, -87.93359980840846]
  },
  {
    "name": "Helfaer Recreation Center",
    "address": "Helfaer Tennis Stadium and Recreation Center, 525 N 16th St, Milwaukee, WI 53233",
    "gps": [43.03713834633788, -87.93355694074631]
  },
  {
    "name": "Alumni Memorial Union",
    "address": "Alumni Memorial Union, 1442 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03975745924356, -87.9308424643562]
  },
  {
    "name": "Marquette Hall",
    "address": "Marquette Hall, 1217 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.038541910572675, -87.92796716810092]
  },
  {
    "name": "Sendik's Food Market",
    "address": "Sendik's Fresh2GO Marquette, 824 N 16th St, Milwaukee, WI 53233",
    "gps": [43.04097404272329, -87.9323554702515]
  },
  {
    "name": "Varsity Theatre",
    "address": "Varsity Theatre, 1326 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.04097404272329, -87.9323554702515]
  },
  {
    "name": "Church of the Gesu",
    "address": "Church of the Gesu, 1145 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03839997685066, -87.92732118526693]
  },
  {
    "name": "Cobeen Hall",
    "address": "Cobeen Hall, 1111 W Wells St, Milwaukee, WI 53233",
    "gps": [43.039528325797086, -87.92594575058156]
  },
  {
    "name": "Raynor Memorial Library",
    "address": "Raynor Memorial Libraries, 1355 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.038223349348776, -87.92959740591931]
  },
  {
    "name": "Carpenter Tower",
    "address": "M. Carpenter Tower, 1032 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03933755158248, -87.92539876992848]
  },
  {
    "name": "Al McGuire Center",
    "address": "Al McGuire Center, 770 N 12th St, Milwaukee, WI 53233",
    "gps": [43.04011693141135, -87.92646507115163]
  },
  {
    "name": "O'Donnell Hall",
    "address": "Rev. Edward J. O'Donnell, S.J., Hall, 725 N 18th St, Milwaukee, WI 53233",
    "gps": [43.04011693141135, -87.92646507115163]
  },
  {
    "name": "Humphrey Hall",
    "address": "Humphrey Apartments, 1716 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03902716362798, -87.93572226098992]
  },
  {
    "name": "Straz Tower",
    "address": "Straz Tower, 915 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03752880813413, -87.92343880768331]
  },
  {
    "name": "Eckstein Hall (Law School)",
    "address": "Marquette University Law School, 1215 W Michigan St, Milwaukee, WI 53233",
    "gps": [43.03709223573189, -87.92657075399066]
  },
  {
    "name": "The Marq",
    "address": "The Marq, 2040 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03885663334461, -87.93883855335847]
  },
  {
    "name": "Mashuda Hall",
    "address": "Mashuda Hall, 1926 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03902912598112, -87.93703077486633]
  },
  {
    "name": "School of Dentistry",
    "address": "School of Dentistry, 1801 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03837664502614, -87.93633821742209]
  },
  {
    "name": "Olin Engineering Center",
    "address": "Olin Engineering Center, 1515 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03845739419746, -87.9318580927306]
  },
  {
    "name": "Cramer Hall",
    "address": "Cramer Hall, 604 N 16th St, Milwaukee, WI 53233",
    "gps": [43.0374992771396, -87.93248591649989]
  },
  {
    "name": "College of Nursing",
    "address": "Marquette University College of Nursing, 530 N 16th St, Milwaukee, WI 53233",
    "gps": [43.03687152884992, -87.93205899982159]
  },
  {
    "name": "Lalumiere Hall",
    "address": "Lalumiere Hall, 1338 W Clybourn St, Milwaukee, WI 53233",
    "gps": [43.0366439228212, -87.9297084433967]
  },
  {
    "name": "Zilber Hall",
    "address": "Zilber Hall, 1250 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.03902078556297, -87.92766311149389]
  },
  {
    "name": "707 Hub",
    "address": "707 Building, 1102 W Wisconsin Ave, Milwaukee, WI 53233",
    "gps": [43.038981578881554, -87.92632200658366]
  },
  {
    "name": "Johnston Hall",
    "address": "Johnston Hall, Milwaukee, WI 53233",
    "gps": [43.03850783706992, -87.92703747383464]
  },
  {
    "name": "Renee Row Apartments",
    "address": "Renee Row Apartments, 927 N Renee St, Milwaukee, WI 53233",
    "gps": [43.04214088388103, -87.9333618071875]
  },
  {
    "name": "The Kensington",
    "address": "The Kensington, 915 N 15th St, Milwaukee, WI 53233",
    "gps": [43.04210841695294, -87.93200927201237]
  },
  {
    "name": "Marquee Place",
    "address": "Marquee Place, 936 N 15th St, Milwaukee, WI 53233",
    "gps": [43.04257380433348, -87.9308294988054]
  },
  {
    "name": "Lark on 14th",
    "address": "Lark on 14th, 811 N 14th St, Milwaukee, WI 53233",
    "gps": [43.04050079707107, -87.93045307133768]
  },
  {
    "name": "Union Sports Annex",
    "address": "Union Sports Annex, 804 N 16th St, Milwaukee, WI 53233",
    "gps": [43.040466482695706, -87.93271831806648]
  }];

  constructor() { }

  getLocations() : ILocation[] {
    return this.locations.sort((a, b) => a.name.localeCompare(b.name));
  }

}
