from controllers.maintencecontroller import get_all_Service_Orders 
from controllers.maintencecontroller import get_jobs_by_id
from controllers.maintencecontroller import edit_jobs

def maintence(app):
    app.route('/allserviceorders', methods=['GET'])(get_all_Service_Orders)
    app.route('/jobsbyid/<int:id_tecnico>', methods=['GET'])(get_jobs_by_id)
    app.route('/editjobs/<int:id_manutencao>', methods=['PUT'])(edit_jobs)