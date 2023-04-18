import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PotenciaOnt, IpConfigONT, registerHistory, connectedToWifi, PrtgInterface, PingData } from '../interface/interface';

@Injectable({
  providedIn: 'root'
})
export class SoporteTecnicoService {
  // ATRIBUTOS
  private urlSmart         : string = 'http://45.230.33.14:4001/smartolt/get_onu_full_status_info_complete/';
  private urlApiWifi       : string = 'http://45.230.33.14:8081/api/2.0/consult_connected_wifi/';
  private urlApiPrtg       : string = 'http://45.230.33.14:8081/api/2.0/consult_estado_municipio/';
  private urlApiPing       : string = 'http://45.230.33.14:4001/mikronode/ping_ms/';
  public  modalStatus      : boolean = false;          // Inidca si modal esta abierto o cerraro
  public  globalLoading    : boolean = false;
  public  loadingSmartolt  : boolean = false;          // Indica si se esta esperando respuesta de API de SmartOLT
  public  loadingConnectedWifi: boolean = false;       // Indica si se esta esperando respuesta de API de conectaados a wifi
  public  loadingPrtg      : boolean = false;       // Indica si se esta esperando respuesta de API PRTG
  public  loadingMkt       : boolean = false;
  public  ontStatus        : boolean = false;             // Estado ONT: true -> online; false -> offline
  public  ontTimeOnline    : string = '0';
  public  powerOnt         : PotenciaOnt = {              // Potencia en ONT
    'tx': 0,
    'rx': 0
  };
  public  historyONT       : registerHistory[] = [];           // Historial en ONT
  public  ipConfigONT      : IpConfigONT = {
    'ipONT'   : '0.0.0.0',
    'mask'    : '0.0.0.0',
    'gateway' : '0.0.0.0'
  }
  private  city             : string = ''
  public   ipStatus         : string = '';
  private   ipService        : string = '';
  public   connectedEthernet: string[][] = [];    // Estados puertos ethernet de ONT
  public   connectedWifi   : connectedToWifi = {
    'header': [],
    'body': []
  }
  public   statusPrtg : PrtgInterface = {
      status: {
        city: '',
        status: ''
      },
      values: {
        jitterNat: 0,
        pingInt:   0,
        pingNat:   0,
        ppInt:     0,
        ppNat:     0,
      }
  }
  public pingStatus   : PingData = {
      pSec: 0,
      pSend: "0",
      pLost: "0%",
      sizePqt: '0',
      minPing: "0ms",
      maxPing: "0ms",
      avgPing: "0ms"
  }

  // CONSTRUCTOR
  constructor(private http: HttpClient) { }

  private changeGlobalLoading (): void {
    this.globalLoading = this.loadingSmartolt || this.loadingConnectedWifi || this.loadingPrtg || this.loadingMkt;
  }

  // METODOS
  public chsngeStatusModal(): void {
    this.modalStatus = !this.modalStatus;
  }

  private extractOntStatus(data: string): boolean {
    let aux: string = data.substring(data.indexOf( 'Run state' ), data.indexOf( 'Match state' ) );

    return true ? aux.includes('online') : false;
  }

  private extractOntOnlineDuration(data: string): string {
    let aux: string = data.substring(data.indexOf( 'ONT online duration' ), data.indexOf( 'Interoperability-mode' ) );
    aux = aux.replace('day', 'día').replace('hour', 'hora').replace('minute', 'minuto').replace('second', 'segundo');
    let array: string[] = aux.split('\n');
    return array[0].split(':')[1].trim();
  }

  private extractPower(data: string[]): PotenciaOnt {
    return {
      'tx': !isNaN(parseFloat(data[6].split(': ')[1])) ? parseFloat(data[6].split(': ')[1]) : 0,
      'rx': !isNaN(parseFloat(data[9].split(': ')[1])) ? parseFloat(data[9].split(': ')[1]) : 0,
    }
  }

  private extractHistory(data: string): registerHistory[] {
    data = data.replace(/Index/g,"Registro");
    data = data.replace(/DownCause/g,"Causa");
    data = data.replace(/PowerFail/g,"ONT sin energía");
    
    let aux: string = data.substring(data.indexOf('Registro'), data.indexOf( this.powerOnt.tx == 0 ? 'Interfaces status:' : 'Name' ) );
    let aux2: string[] = aux.split('Registro               :');
    
    // let logSmartolt: string[][] = aux.split('\n').map(item => item.split(': '));
    // logSmartolt.pop();
    // this.powerOnt.tx == 0 ? null : logSmartolt.pop();

    // aux2.pop();
    aux2.shift();

    let logSmartolt : registerHistory[] = aux2.map(item => {
      let index = item.split('\n');
      return {
        'index'   : index[0].trim(),
        'upTime'  : index[1].split(' :')[1].trim(),
        'downTime': index.length > 4 ? index[2].split(' :')[1].trim() : 'Null',
        'cause'   : index.length > 4 ? index[3].split(' :')[1].trim() : 'Null'
      }
    });

    return logSmartolt;
  }

  private extractIpConfig(data: string): IpConfigONT {
    data = data.substring(data.indexOf('IPv4 address'), data.indexOf('Manage VLAN'));
    let array: string[] = data.split('\n');
    let aux :string[][] = array.map(item => item.split(':'));

    return {
      'ipONT'   : aux[0][1].trim(),
      'mask'    : aux[1][1].trim(),
      'gateway' : aux[2][1].trim()
    }

  }

  private identifyIpStatus( ipService: string, IpConfigONT: IpConfigONT) : string {
    let status : string = '';

    if (ipService !== IpConfigONT.ipONT) {
      status += 'ERROR IP SERVICIO/ONT';
    }
    if ( IpConfigONT.ipONT.substring(0, IpConfigONT.ipONT.lastIndexOf('.')) !== IpConfigONT.gateway.substring(0, IpConfigONT.gateway.lastIndexOf('.')) ) {
      status += ' ERROR GATEWAY'; 
    }

    return status;
  }

  private extractConnectedEthernet(data: string): string[][] {
    let array: string[] = data.substring(data.indexOf('Interfaces status:'), data.indexOf('VoIP status:')).split('\n');
    let connectedEthernet: string[][] = [];
    if (array.length > 3) {
      connectedEthernet = array.map(item => {
        let aux: string[] = item.split(' ');

        aux = aux.filter(item => item !== '');
        return aux;
      })
      connectedEthernet.shift();
      connectedEthernet.pop();
      
      connectedEthernet[0] = connectedEthernet[0][0].split('   ');
      connectedEthernet.map(item => {
        item.shift()
        return item;
      });
      
    }
    return connectedEthernet;
  }

  public getOnuFullStatusInfoComplete(query: number, ipService: string, city: string): void {
    this.loadingSmartolt = false;
    this.ipService = ipService;
    this.city = city;

    let search: string = query.toString();

    this.http.get<string>(this.urlSmart + search)
      .subscribe((resp) => {
        resp = resp.trim();        
        let array = resp.split('\n');

        // Extraer estado de ONT
        this.ontStatus = this.extractOntStatus(resp);

        if( this.ontStatus ) {
          // Extraer duración de ONT en linea
          this.ontTimeOnline = this.extractOntOnlineDuration(resp);
          
          // Extraer potenciancias de la consulta
          this.powerOnt = this.extractPower(array);

          // Extraer dispositivos conectados por cable a ONT
          this.connectedEthernet = this.extractConnectedEthernet(resp);

          // Extraer IP configurada en ONT
          this.ipConfigONT = this.extractIpConfig(resp);

          // Verificar IP
          this.ipStatus = this.identifyIpStatus(ipService, this.ipConfigONT);

          // Consultar ping
          this.consultPingMikrotikService( city, this.ipConfigONT.ipONT )

          // Consultar Conectados a wifi  
          this.getConnectedWifi( this.ipConfigONT.ipONT )
          

        }
        else {
          this.powerOnt = {
            'tx': 0,
            'rx': 0
          };
          this.historyONT = [];
        }

        // Extraer log de la consulta
        this.historyONT = this.extractHistory(resp);

        // Cambio de estado de carga
        this.loadingSmartolt = true;
        this.changeGlobalLoading();
      }
      )
  }

  public getConnectedWifi( ipService: string ): void {
    this.loadingConnectedWifi = false;
    let body = {
      ip: ipService
    }
    this.http.post<connectedToWifi>(this.urlApiWifi, body)
      .subscribe((resp) => {
        let header: string[]  = resp.header;

        let body = resp.body.map(item => {
        //let a = item[6].split('(');

        let hours: number   = Math.floor(Number(item[3]) / 3600);
        let minute: number  = Math.floor((Number(item[3])  - (hours * 3600)) / 60); // get minutes;
        let timeString = hours.toString() + ' hora(s) ' + minute.toString() + ' minuto(s)';        
        return item.slice(0, 3).concat(timeString).concat(item.slice(4,))        
        //return item.slice(0, 3).concat(timeString).concat(item.slice(4,2)).concat(a[0]).concat(item.slice(6,))
        } );
        
        this.connectedWifi = {
          'header': resp.header,
          'body': body
        }
        this.loadingConnectedWifi = true;
        this.changeGlobalLoading();
      }, (err) => {
        this.connectedWifi = {
          'header': ['Error al Consultar ONT'],
          'body': ['Error al Consultar ONT']
        }
        this.loadingConnectedWifi = true;
        this.changeGlobalLoading();
      })
  }

  public getPrtgStatus( city: string ): void {
    this.loadingPrtg = false;
    let body = {
      municipio: city
    }
    this.http.post<PrtgInterface>(this.urlApiPrtg, body)
      .subscribe((resp) => {
        this.statusPrtg = resp;
        this.loadingPrtg = true;
        this.changeGlobalLoading();
      })
  }

  public consultPingMikrotikService( city = this.city, ip = this.ipService): void {
    this.loadingMkt = false

    const url = this.urlApiPing + city.toUpperCase() + '/' + ip + '/10';
    this.http.get<PingData>(url)
      .subscribe((resp) => {
        this.pingStatus = resp
        this.loadingMkt = true;
      })

  }

  public clearInfo(): void {
    this.modalStatus = false;          // Inidca si modal esta abierto o cerraro
    this.globalLoading = false;
    this.loadingSmartolt = false;          // Indica si se esta esperando respuesta de API de SmartOLT
    this.loadingConnectedWifi= false;       // Indica si se esta esperando respuesta de API de conectaados a wifi
    this.loadingPrtg = false;       // Indica si se esta esperando respuesta de API PRTG
    this.loadingMkt = false;
    this.ontStatus = false;             // Estado ONT: true -> online; false -> offline
    this.ontTimeOnline = '0';
    this.powerOnt = {              // Potencia en ONT
      'tx': 0,
      'rx': 0
    };
    this.historyONT  = [];           // Historial en ONT
    this.ipConfigONT = {
      'ipONT'   : '0.0.0.0',
      'mask'    : '0.0.0.0',
      'gateway' : '0.0.0.0'
    }
    this.city = ''
    this.ipStatus = '';
    this.ipService = '';
    this.connectedEthernet = [];    // Estados puertos ethernet de ONT
    this.connectedWifi = {
      'header': [],
      'body': []
    }
    this.statusPrtg = {
        status: {
          city: '',
          status: ''
        },
        values: {
          jitterNat: 0,
          pingInt:   0,
          pingNat:   0,
          ppInt:     0,
          ppNat:     0,
        }
    }
    this.pingStatus = {
        pSec: 0,
        pSend: "0",
        pLost: "0%",
        sizePqt: '0',
        minPing: "0ms",
        maxPing: "0ms",
        avgPing: "0ms"
    }
  }
} // End of class