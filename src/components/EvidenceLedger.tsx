import React from 'react';
import { EvidenceItem, LearningOutcome } from '../types';
import { 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Pencil, 
  Trash2,
  Star
} from 'lucide-react';

interface EvidenceLedgerProps {
  items: EvidenceItem[];
  learningOutcomes: LearningOutcome[];
  onOpenDetails: (item: EvidenceItem) => void;
  onEdit?: (item: EvidenceItem) => void;
  onDelete?: (id: string) => void;
  isOwner?: boolean;
}

export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({
  items,
  learningOutcomes,
  onOpenDetails,
  onEdit,
  onDelete,
  isOwner = false,
}) => {
  const getLU = (id: string) => learningOutcomes.find((lu) => lu.id === id);

  return (
    <div className="bg-white border border-[#D5D5D0] overflow-hidden">
      <div className="p-4 bg-[#F4F3EF] border-b border-[#D5D5D0] flex items-center justify-between">
        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
            Evidence Ledger // Overzichtstabel
          </h3>
          <p className="font-mono text-[11px] text-[#6B6B6B]">
            Compacte tabel voor snelle scanbaarheid van criteria, sprints en gekoppelde bewijsstukken.
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-[#050505] bg-white px-2.5 py-1 border border-[#D5D5D0]">
          {items.length} {items.length === 1 ? 'dossier' : 'dossiers'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono border-collapse">
          <thead>
            <tr className="border-b border-[#D5D5D0] bg-[#F4F3EF]/60 text-[#6B6B6B] uppercase tracking-wider text-[11px]">
              <th scope="col" className="p-3.5 font-bold text-[#050505]">Sprint</th>
              <th scope="col" className="p-3.5 font-bold text-[#050505]">Titel & Onderzoeksvraag</th>
              <th scope="col" className="p-3.5 font-bold text-[#050505]">Leeruitkomsten</th>
              <th scope="col" className="p-3.5 font-bold text-[#050505]">Tools & Artifacten</th>
              <th scope="col" className="p-3.5 font-bold text-[#050505]">Datum</th>
              <th scope="col" className="p-3.5 font-bold text-[#050505]">Status</th>
              <th scope="col" className="p-3.5 font-bold text-[#050505] text-right">Actie</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D5D5D0]">
            {items.map((item) => {
              const isVoldoende = item.evaluationStatus === 'voldoende';
              const isZelfevaluatie = item.evaluationStatus === 'zelfevaluatie_klaar';

              return (
                <tr 
                  key={item.id}
                  className="hover:bg-[#F4F3EF]/80 transition-colors group cursor-pointer"
                  onClick={() => onOpenDetails(item)}
                >
                  {/* Sprint */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#050505] text-white text-[11px] font-bold">
                      {item.isFeatured && <Star className="w-2.5 h-2.5 text-[#E32636] fill-[#E32636]" />}
                      S0{item.sprintId}
                    </span>
                  </td>

                  {/* Title & Excerpt */}
                  <td className="p-3.5 max-w-sm">
                    <div className="font-sans font-bold text-[#050505] text-xs sm:text-sm group-hover:text-[#E32636] transition-colors mb-0.5">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#6B6B6B] truncate font-sans">
                      {item.investigated}
                    </div>
                  </td>

                  {/* Learning Outcomes */}
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {item.learningOutcomeIds.map((luId) => {
                        const lu = getLU(luId);
                        return (
                          <span
                            key={luId}
                            className="px-1.5 py-0.5 bg-[#F4F3EF] border border-[#D5D5D0] text-[#050505] text-[10px] font-bold"
                          >
                            {lu ? lu.code : luId}
                          </span>
                        );
                      })}
                    </div>
                  </td>

                  {/* Tools & Artifacts */}
                  <td className="p-3.5 max-w-xs">
                    <div className="flex flex-wrap gap-1">
                      {item.toolsUsed.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="text-[10px] text-[#6B6B6B] bg-white px-1.5 py-0.5 border border-[#D5D5D0]">
                          {t}
                        </span>
                      ))}
                      {item.media.length > 0 && (
                        <span className="text-[10px] text-[#050505] font-bold bg-[#F4F3EF] px-1.5 py-0.5 border border-[#D5D5D0]">
                          {item.media.length} {item.media.length === 1 ? 'bestand' : 'bestanden'}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="p-3.5 whitespace-nowrap text-[#6B6B6B] text-[11px]">
                    {item.date}
                  </td>

                  {/* Status */}
                  <td className="p-3.5 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold border ${
                      isVoldoende 
                        ? 'bg-[#050505] text-white border-[#050505]'
                        : isZelfevaluatie
                        ? 'bg-white text-[#050505] border-[#050505]'
                        : 'bg-[#F4F3EF] text-[#6B6B6B] border-[#D5D5D0]'
                    }`}>
                      {isVoldoende ? (
                        <CheckCircle className="w-3 h-3 text-[#E32636]" />
                      ) : (
                        <Clock className="w-3 h-3 text-[#6B6B6B]" />
                      )}
                      <span>
                        {isVoldoende ? 'VOLDOENDE' : isZelfevaluatie ? 'ZELFEVALUATIE' : 'IN BEHANDELING'}
                      </span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {isOwner && onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1 text-[#6B6B6B] hover:text-[#050505] hover:bg-[#F4F3EF] border border-transparent hover:border-[#D5D5D0]"
                          title="Bewerken"
                          aria-label="Bewerk dossier"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                      )}
                      {isOwner && onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 text-[#6B6B6B] hover:text-[#E32636] hover:bg-[#F4F3EF] border border-transparent hover:border-[#D5D5D0]"
                          title="Verwijderen"
                          aria-label="Verwijder dossier"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenDetails(item)}
                        className="px-2 py-1 bg-[#050505] hover:bg-[#E32636] text-white text-[10px] uppercase font-bold tracking-wider transition-colors inline-flex items-center gap-1"
                      >
                        <span>Bekijk</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

