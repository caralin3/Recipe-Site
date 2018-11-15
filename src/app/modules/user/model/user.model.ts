export class FirebaseUserModel {
  id: string;
  image: string;
  name: string;
  provider: string;

  constructor(){
    this.id = "";
    this.image = "";
    this.name = "";
    this.provider = "";
  }
}