import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  url = 'https://translation.googleapis.com/language/translate/v2';
  headers = new HttpHeaders().set(
    'Authorization',
    'Bearer ya29.c.Ko8BzAdO3YS86USzrhWXQ_7jzYjlrB2FpBfElLHzkAf68TAddf52iyKnc_P6uacQLjDEZCFkpE5wLTBiMSyDUhLphiho_XCAIv0kul_27ZyLD58T5N63JxAbl__YD1Gzzi8u8qVIaLbrJTHw_j6F1KROwy1lS5cTAL-DLOqpzqV4Bl1S_waN6b-SNle3widziHg'
  );

  constructor(private http: HttpClient) {}

  translate(text: string) {
    return this.http
      .post(
        this.url,
        {
          q: text,
          source: 'en',
          target: 'hi',
          format: 'text',
        },
        { headers: this.headers }
      )
      .pipe(
        map((res: any) => {
          return res.data.translations[0].translatedText;
        })
      );
  }
}
