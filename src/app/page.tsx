"use client";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type Guest } from "~/types/guest";

export default function Home() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useUtils();

  const register = api.guest.register.useMutation({
    onSuccess: () => {
      setName("");
      setIsSubmitting(false);
      utils.guest.getAll.invalidate();
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  const { data: guests, isLoading } = api.guest.getAll.useQuery();

  const handleSubmit = () => {
    if (name.trim().length > 0 && !isSubmitting) {
      setIsSubmitting(true);
      register.mutate({ name: name.trim(), attending });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen p-4 flex items-center justify-center">
      <div className="pixel-container max-w-2xl w-full">
        <h1 className="pixel-title">🍻 PAGADA DE PISO 🍻</h1>
        
        <div className="space-y-6">
          {/* Formulario de registro */}
          <div className="space-y-4">
            <div>
              <label className="pixel-label">TU APODO:</label>
              <input
                type="text"
                placeholder="Escribe tu apodo aquí..."
                className="pixel-input w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={20}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="pixel-label">¿VAS A IR?</label>
              <div className="pixel-radio-group">
                <label>
                  <input
                    type="radio"
                    className="pixel-radio"
                    name="attending"
                    checked={attending}
                    onChange={() => setAttending(true)}
                    disabled={isSubmitting}
                  />
                  🍺 SÍ, VOY!
                </label>
                <label>
                  <input
                    type="radio"
                    className="pixel-radio"
                    name="attending"
                    checked={!attending}
                    onChange={() => setAttending(false)}
                    disabled={isSubmitting}
                  />
                  😢 NO PUEDO IR
                </label>
              </div>
            </div>

            <button
              className={`pixel-button w-full ${isSubmitting ? 'pixel-loading' : ''}`}
              onClick={handleSubmit}
              disabled={name.trim().length === 0 || isSubmitting}
            >
              {isSubmitting ? "REGISTRANDO..." : "REGISTRAR ASISTENCIA"}
            </button>
          </div>

          {/* Tabla de invitados */}
          <div>
            <h2 className="pixel-subtitle">📊 INVITADOS REGISTRADOS</h2>
            
            {isLoading ? (
              <div className="text-center py-8 pixel-loading">
                <p>CARGANDO INVITADOS...</p>
              </div>
            ) : guests && guests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="pixel-table">
                  <thead>
                    <tr>
                      <th>APODO</th>
                      <th>PUNTOS</th>
                      <th>ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guests.map((guest: Guest) => (
                      <tr key={guest.id} className="pixel-success">
                        <td>{guest.name}</td>
                        <td>{guest.points} pts</td>
                        <td>
                          {guest.attending ? (
                            <span className="text-green-400">🍺 ASISTE</span>
                          ) : (
                            <span className="text-red-400">😢 NO ASISTE</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No hay invitados registrados aún...</p>
                <p className="text-sm text-gray-500 mt-2">¡Sé el primero en registrarte!</p>
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {guests && guests.length > 0 && (
            <div className="text-center space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="pixel-container">
                  <p className="text-sm">TOTAL INVITADOS</p>
                  <p className="pixel-title text-lg">{guests.length}</p>
                </div>
                <div className="pixel-container">
                  <p className="text-sm">PUNTOS TOTALES</p>
                  <p className="pixel-title text-lg">{guests.reduce((sum, guest) => sum + guest.points, 0)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
