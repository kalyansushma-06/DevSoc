// components/CertificateCanvas.jsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Trash2, Maximize2 } from "lucide-react";

export default function CertificateCanvas({
  templateUrl,
  data = {},
  layout = {},
  isEditable = false,
  onLayoutChange,
  qrUrl,
  selectedId,
  setSelectedId,
}) {
  const containerRef = useRef(null);
  const [activeAction, setActiveAction] = useState(null);
  const [internalSelected, setInternalSelected] = useState(null);
  const [scale, setScale] = useState(1);

  const activeSelected = selectedId !== undefined ? selectedId : internalSelected;
  const updateSelected = (id) => {
    if (setSelectedId) setSelectedId(id);
    else setInternalSelected(id);
  };

  // Base layout defaults
  const defaultLayout = {
    name: { visible: true, x: 50, y: 45, fontSize: 34, color: "#0f172a", bold: true },
    event: { visible: true, x: 50, y: 55, fontSize: 20, color: "#334155", bold: false },
    date: { visible: true, x: 25, y: 80, fontSize: 14, color: "#64748b", bold: false },
    certId: { visible: true, x: 50, y: 88, fontSize: 12, color: "#94a3b8", bold: false },
    qr: { visible: true, x: 75, y: 78, size: 75 },
  };

  const currentLayout = { ...defaultLayout, ...layout };

  const notifyChange = (updated) => {
    if (onLayoutChange) onLayoutChange(updated);
  };

  // Proportional responsive scaling: keeps text/QR 100% proportional to canvas width
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          // Standard reference base width = 850px
          setScale(width / 850);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Delete / Hide element
  const handleDelete = (key, e) => {
    e.stopPropagation();
    const updated = {
      ...currentLayout,
      [key]: { ...currentLayout[key], visible: false },
    };
    if (activeSelected === key) updateSelected(null);
    notifyChange(updated);
  };

  // Start Move
  const handleStartMove = (key) => (e) => {
    if (!isEditable) return;
    e.stopPropagation();
    updateSelected(key);

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    setActiveAction({
      type: "move",
      key,
      startX: clientX,
      startY: clientY,
      initX: currentLayout[key]?.x ?? 50,
      initY: currentLayout[key]?.y ?? 50,
    });
  };

  // Start Smooth Resize
  const handleStartResize = (key) => (e) => {
    if (!isEditable) return;
    e.stopPropagation();
    e.preventDefault();

    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;

    const initSize =
      key === "qr"
        ? currentLayout[key]?.size || 75
        : currentLayout[key]?.fontSize || 24;

    setActiveAction({
      type: "resize",
      key,
      startX: clientX,
      startY: clientY,
      initSize,
    });
  };

  // Handle Drag Move & Resize
  useEffect(() => {
    if (!activeAction || !containerRef.current) return;

    const handlePointerMove = (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX ?? e.touches?.[0]?.clientX;
      const clientY = e.clientY ?? e.touches?.[0]?.clientY;
      if (clientX === undefined || clientY === undefined) return;

      if (activeAction.type === "move") {
        const deltaX = ((clientX - activeAction.startX) / rect.width) * 100;
        const deltaY = ((clientY - activeAction.startY) / rect.height) * 100;

        let newX = Math.round(activeAction.initX + deltaX);
        let newY = Math.round(activeAction.initY + deltaY);

        newX = Math.max(2, Math.min(98, newX));
        newY = Math.max(2, Math.min(98, newY));

        notifyChange({
          ...currentLayout,
          [activeAction.key]: {
            ...currentLayout[activeAction.key],
            x: newX,
            y: newY,
          },
        });
      } else if (activeAction.type === "resize") {
        // Diagonal delta (down-right increases, up-left decreases)
        const deltaX = clientX - activeAction.startX;
        const deltaY = clientY - activeAction.startY;
        const delta = (deltaX + deltaY) / 2;

        if (activeAction.key === "qr") {
          // Expanded QR limit: min 30px, max 350px
          const newSize = Math.max(
            30,
            Math.min(350, Math.round(activeAction.initSize + delta * 0.7))
          );
          notifyChange({
            ...currentLayout,
            qr: { ...currentLayout.qr, size: newSize },
          });
        } else {
          // Expanded Font Size limit: min 10px, max 200px
          const newFontSize = Math.max(
            10,
            Math.min(200, Math.round(activeAction.initSize + delta * 0.45))
          );
          notifyChange({
            ...currentLayout,
            [activeAction.key]: {
              ...currentLayout[activeAction.key],
              fontSize: newFontSize,
            },
          });
        }
      }
    };

    const handlePointerUp = () => {
      setActiveAction(null);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [activeAction, currentLayout]);

  const renderTextElement = (key, textValue, label) => {
    const el = currentLayout[key];
    if (!el || el.visible === false) return null;

    const hasText = textValue && textValue.trim().length > 0;

    // In student/public view: if empty, do not show any stray placeholder
    if (!isEditable && !hasText) {
      return null;
    }

    // In editor view: if empty, show label placeholder so admin can position it
    const displayText = hasText ? textValue : `[${label}]`;
    const isSelected = isEditable && activeSelected === key;
    const computedFontSize = (el.fontSize || 20) * scale;

    return (
      <div
        key={key}
        onMouseDown={handleStartMove(key)}
        onTouchStart={handleStartMove(key)}
        onClick={(e) => {
          e.stopPropagation();
          updateSelected(key);
        }}
        style={{
          left: `${el.x}%`,
          top: `${el.y}%`,
          transform: "translate(-50%, -50%)",
          color: el.color || "#0f172a",
          fontSize: `${computedFontSize}px`,
          fontWeight: el.bold ? "700" : "500",
          lineHeight: 1.2,
        }}
        className={`absolute text-center whitespace-nowrap select-none transition-shadow ${
          isEditable ? "cursor-move" : ""
        } ${
          isSelected
            ? "ring-2 ring-indigo-500 bg-indigo-500/10 rounded px-2 py-0.5 shadow-2xl z-30"
            : isEditable
            ? "hover:ring-1 hover:ring-indigo-400/60 rounded px-1.5 py-0.5"
            : ""
        }`}
      >
        {displayText}

        {/* Delete & Resize UI when selected */}
        {isSelected && (
          <>
            <button
              type="button"
              onClick={(e) => handleDelete(key, e)}
              className="absolute -top-3.5 -right-3.5 w-6 h-6 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl transition cursor-pointer"
              title="Delete element"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <div
              onMouseDown={handleStartResize(key)}
              onTouchStart={handleStartResize(key)}
              className="absolute -bottom-3 -right-3 w-6 h-6 bg-indigo-600 hover:bg-indigo-500 border-2 border-white cursor-se-resize rounded-full flex items-center justify-center shadow-xl transition"
              title="Drag to smoothly scale text"
            >
              <Maximize2 className="w-3 h-3 text-white" />
            </div>
          </>
        )}
      </div>
    );
  };

  const computedQrSize = (currentLayout.qr?.size || 75) * scale;

  return (
    <div
      ref={containerRef}
      onClick={() => isEditable && updateSelected(null)}
      className="relative w-full overflow-hidden select-none shadow-2xl rounded-xl border border-white/10"
      style={{ aspectRatio: "1.414 / 1", backgroundColor: "#0b0f19" }}
    >
      {/* Background Template */}
      {templateUrl ? (
        <img
          src={templateUrl}
          alt="Certificate Template"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-sm border-2 border-dashed border-slate-700 m-4 rounded-lg pointer-events-none">
          Upload or select a template to preview certificate
        </div>
      )}

      {/* Recipient Name */}
      {renderTextElement("name", data.recipientName || data.name, "Participant Name")}

      {/* Event Name */}
      {renderTextElement("event", data.eventName || data.event, "Event Name")}

      {/* Issue Date */}
      {renderTextElement(
        "date",
        data.issueDate || data.date ? `Date: ${data.issueDate || data.date}` : "",
        "Date"
      )}

      {/* Certificate ID */}
      {renderTextElement(
        "certId",
        data.certificateId || data.id ? `ID: ${data.certificateId || data.id}` : "",
        "Cert ID"
      )}

      {/* Custom Text Elements */}
      {Object.keys(currentLayout)
        .filter((k) => k.startsWith("custom_"))
        .map((k) => renderTextElement(k, currentLayout[k].text, "Custom Text"))}

      {/* Dynamic QR Code */}
      {currentLayout.qr?.visible !== false && (
        <div
          onMouseDown={handleStartMove("qr")}
          onTouchStart={handleStartMove("qr")}
          onClick={(e) => {
            e.stopPropagation();
            updateSelected("qr");
          }}
          style={{
            left: `${currentLayout.qr.x}%`,
            top: `${currentLayout.qr.y}%`,
            transform: "translate(-50%, -50%)",
          }}
          className={`absolute bg-white p-1 rounded-md shadow-md select-none ${
            isEditable ? "cursor-move" : ""
          } ${
            isEditable && activeSelected === "qr"
              ? "ring-2 ring-indigo-500 shadow-2xl z-30"
              : isEditable
              ? "hover:ring-1 hover:ring-indigo-400/60"
              : ""
          }`}
        >
          <QRCodeSVG
            value={qrUrl || "https://devsoc-three.vercel.app/verify?id=DEMO"}
            size={Math.max(25, computedQrSize)}
            level="H"
          />

          {isEditable && activeSelected === "qr" && (
            <>
              <button
                type="button"
                onClick={(e) => handleDelete("qr", e)}
                className="absolute -top-3 -right-3 w-6 h-6 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-xl transition cursor-pointer"
                title="Delete QR Code"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div
                onMouseDown={handleStartResize("qr")}
                onTouchStart={handleStartResize("qr")}
                className="absolute -bottom-3 -right-3 w-6 h-6 bg-indigo-600 hover:bg-indigo-500 border-2 border-white cursor-se-resize rounded-full flex items-center justify-center shadow-xl transition"
                title="Drag to smoothly scale QR Code"
              >
                <Maximize2 className="w-3 h-3 text-white" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}