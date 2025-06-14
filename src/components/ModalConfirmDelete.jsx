export default function ModalConfirmDelete({ onConfirm, onCancel }) {
 return (
  <div
   className="fixed inset-0 flex justify-center items-center z-50"
   style={{ backdropFilter: 'blur(4px) brightness(0.7)' }}
   onClick={onCancel}
  >
   <div
    className="bg-[#2a2a3f] rounded p-6 max-w-sm w-full"
    onClick={(e) => e.stopPropagation()}
   >
    <h2 className="text-lg font-bold mb-4">Confirmar exclusão</h2>
    <p>Tem certeza que deseja excluir esta tarefa? Esta ação é irreversível</p>
    <div className="mt-6 flex justify-end gap-4">
     <button
      onClick={onCancel}
      className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-400"
     >
      Cancelar
     </button>
     <button
      onClick={onConfirm}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
     >
      Excluir
     </button>
    </div>
   </div>
  </div>
 );
}
