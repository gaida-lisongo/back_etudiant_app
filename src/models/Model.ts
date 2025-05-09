interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

const BASE_URL = "https://modal.inbtp.net/?"
let params  = null
let sql = null

export default abstract class Model {

  constructor() {
    console.log('Model initialized:', BASE_URL);
  }

  protected formatResponse<T>(success: boolean, message: string, data?: T): ApiResponse<T> {
    return {
      status: success ? 'success' : 'error',
      message,
      ...(data && { data })
    };
  }

  async executeQuery<T>(query: string, params?: any[]): Promise<ApiResponse<T>> {
    try {
      //Send to BASE_URL request with params and sql like this:https://modal.inbtp.net/?params=[1]&sql=SELECT%20*%20FROM%20agent%20WHERE%20id_grade=?
      //sql is SELECT%20*%20FROM%20agent%20WHERE%20id_grade=?
      //and params is [1]
      // all reponse are this forme example:[{"id":151,"nom":"Lisongo","post_nom":"Baita","prenom":"Gaida","sexe":"M","matricule":"2025-1708","grade":"LICENCE","id_grade":1,"statut":"PERMANANT","mdp":null,"telephone":null,"adresse":null,"e_mail":null,"avatar":null,"date_naiss":"2021-03-03","solde":null}]
      

      const encodedParams = encodeURIComponent(JSON.stringify(params));
      const encodedSql = encodeURIComponent(query);
      const url = `${BASE_URL}params=${encodedParams}&sql=${encodedSql}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      return this.formatResponse(true, 'Query executed successfully', data as T);
    } catch (error) {
      return this.formatResponse(false, (error as Error).message);
    }
  }
}