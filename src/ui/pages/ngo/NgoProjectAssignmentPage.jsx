import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationsByProject } from '../../../infrastructure/api/applicationApi.js';
import { getAssignmentsByProject, createAssignment } from '../../../infrastructure/api/assignmentApi.js';

function NgoProjectAssignmentPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [approvedCandidates, setApprovedCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    Promise.all([
      getAssignmentsByProject(id),
      getApplicationsByProject(id),
    ]).then(([asgn, applications]) => {
      setAssignment(asgn);
      setApprovedCandidates(applications.filter((a) => a.status === 'approved'));
      setLoading(false);
    });
  }, [id]);

  async function handleSelect(applicationId) {
    setErrorMsg('');
    try {
      const created = await createAssignment(applicationId);
      setAssignment(created);
    } catch (err) {
      if (err?.response?.status === 403) {
        setErrorMsg('No tienes permiso para realizar esta acción.');
      } else {
        setErrorMsg('Error al crear el assignment. Intenta de nuevo.');
      }
    }
  }

  return (
    <div>
      <h1>Asignación del proyecto</h1>

      {errorMsg && <p role="alert">{errorMsg}</p>}

      {loading && <p>Cargando...</p>}

      {!loading && assignment && (
        <section>
          <h2>Candidato seleccionado</h2>
          <p>{assignment.student_name}</p>
          <p>{assignment.student_email}</p>
          <p>{assignment.start_date}</p>
        </section>
      )}

      {!loading && !assignment && approvedCandidates.length === 0 && (
        <p>No hay candidatos aprobados para este proyecto.</p>
      )}

      {!loading && !assignment && approvedCandidates.length > 0 && (
        <section>
          <h2>Candidatos aprobados</h2>
          {approvedCandidates.map((app) => (
            <article key={app.id}>
              <p>{app.student.name}</p>
              <p>{app.student.email}</p>
              <p>{app.compatibility_score}</p>
              <button onClick={() => handleSelect(app.id)}>Seleccionar</button>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}

export default NgoProjectAssignmentPage;
