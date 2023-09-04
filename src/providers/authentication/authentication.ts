import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
// let apiUrl = "http://spinachrabanzo/_pbookApi/api/"; // 
let apiUrl = "https://gcccsbsit.xyz/_pabookApi/api/" //hostinger

@Injectable()
export class AuthenticationProvider {
  handleError: any;
  constructor(private http: HttpClient) {
  }

  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
  })

  registerAccount(credentials: any) {
    let cred = JSON.stringify(credentials);
    return this.http.post(apiUrl + "register/users/Customer", cred)
      .pipe(catchError(this.handleError));
  }

  loginAccount(credentials: any): Observable<any> {
    let cred = JSON.stringify(credentials);
    return this.http.post(apiUrl + "login/users", cred, { headers: this.headers }).pipe(map(data => data))
  }
  logout(id: any) {
    return this.http.put(`${apiUrl}/updateUserSegment/segment="Inactive"/user_id=${id}`, { headers: this.headers }).pipe(map(data => data))
  }

  changePass(information): Observable<any> {
    let info = JSON.stringify(information);
    return this.http.put(`${apiUrl}/changePassword`, info, { headers: this.headers }).pipe(map(data => data));
  }

  checkPassword(information): Observable<any> {
    let info = JSON.stringify(information);
    return this.http.post(`${apiUrl}getPass/`, info).pipe(map((res) => res));
  }

  bookEvent(information: any) {
    let info = JSON.stringify(information);
    return this.http.post(apiUrl + "book/pabook_reservations", info);
  }

  allEvents(): Observable<any> {
    return this.http.get(apiUrl + "events").pipe(map((res) => res))
  }

  sendVerification(info, registerCode) {
    let infos = JSON.stringify(info)
    console.log(info.code);
    return this.http.post(`${apiUrl}sendVcode/${registerCode}`, infos, { headers: this.headers }).pipe(map(data => data));
  }

  getMassSched(tbl_name, fld_name, value) {
    return this.http.get(apiUrl + `${tbl_name}/${fld_name}/${value}`).pipe(map((res) => res))
  }

  selectAll(tbl_name: any) {
    return this.http.get(`${apiUrl}${tbl_name}`).pipe(map((res) => res))
  }

  insertApplication(info: any) {
    let infos = JSON.stringify(info);
    return this.http.post(`${apiUrl}insert/tbl_application_groom/tbl_application_bride/tbl_sponsors`, infos)
  }

  updateProfile(fname, lname, email, mobile, id) {
    return this.http.post(`${apiUrl}users/fname="${fname}", lname="${lname}", email="${email}", mobile="${mobile}"/user_id="${id}"`,
      { headers: this.headers }).pipe(map(data => data));
  }

  uploadImage(imageFile: any) {
    let file = JSON.stringify(imageFile);
    // let url = "http://spinachrabanzo/_pbookApi/requirements_images_from_users/uploadPicture.php/";
    let url = "https://www.gcccsbsit.xyz/_pabookApi/requirements_images_from_users/uploadPicture.php/";
    return this.http.post(`${url}`, file, { headers: this.headers }).pipe(map(data => data))
  }

  insert(data: any) {
    let dataWillSend = JSON.stringify([data]);
    return this.http.post(`${apiUrl}insertLang/tbl_cancelations_reSchedule/`, dataWillSend);
  }

  update(table: any, field: any, id: any) {
    return this.http.post(`${apiUrl}${table}/${field}/${id}`, { headers: this.headers }).pipe(map(data => data));
  }

  join(tbl_one, id_one, tbl_two, id_two) {
    return this.http.get(`${apiUrl}${tbl_one}/${id_one}/${tbl_two}/${id_two}`);
  }

  sendEmail(data: any): Observable<any> {
    let dataWillSend = JSON.stringify(data);
    return this.http.post(`https://www.gcccsbsit.xyz/_pabookApi/sendEmail.php`, dataWillSend);
  }

  validateEmail(email) {
    var reg = /^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    var res = reg.test(email);
    if (!res) {
      return false;
    } else {
      return true;
    }
  }
}
