import { useState, useContext, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HtmlContext } from "../contexts/HtmlContext";
import { PromptTemplate } from "../utils/Prompts";
import PromptDialog from "../components/PromptDialog";
import EditForms from "../components/EditForms";
import DragDropList from "../components/DragDropList";

const AdvancedResult = () => {
  const { htmlArray } = useContext(HtmlContext);

  const [code, setCode] = useState<string>("");
  const previewFrame = useRef<HTMLIFrameElement>(null);
  const codeTextarea = useRef<HTMLTextAreaElement>(null);

  const [codeVisible, setCodeVisible] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(true);

  const [selectedSection, setSelectedSection] = useState<PromptTemplate>("createNavigation");

  const location = useLocation();

  const originalFormValues = location.state || {};

  useEffect(() => {
    // Update the code state with the current answer
    if (htmlArray) {
      setCode(htmlArray.map((block) => block.content).join(""));
    }
  }, [htmlArray]);

  useEffect(() => {
    handleRunCode();
  }, [code]);

  const handleRunCode = () => {
    if (previewFrame.current) {
      const iframeDocument = previewFrame.current.contentDocument;
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(code);
        iframeDocument.close();
      }
    }
  };

  const handleCopy = async () => {
    // TODO? show notification that says text was copied to clipboard
    try {
      if (codeTextarea.current) {
        await navigator.clipboard.writeText(codeTextarea.current.value);
        console.log("Copied");
      }
    } catch (error) {
      console.log("Error when copying to clipboard: ", error);
    }
  };

  handleRunCode();

  const handleSaveToFile = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const fileLink = document.createElement("a");
    fileLink.href = url;
    fileLink.download = "your-website.html";
    fileLink.dispatchEvent(new MouseEvent("click"));
    URL.revokeObjectURL(url);
  };

  /* toggle code frame's visibiltiy */
  const toggleCodeVisibility = () => {
    setCodeVisible(!codeVisible);
  };
  /* toggle preview frame's visibiltiy */
  const togglePreviewVisibility = () => {
    setPreviewVisible(!previewVisible);
  };

  /* parse original form values for prompt dialog */
  const parseFormValues = (obj: Record<string, object>): string => {
    if (!obj) {
      return "";
    }
    return Object.entries(obj)
      .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
      .join(", ");
  };

  // template for section details
  const getSectionDetails = (selectedSection: PromptTemplate) => {
    switch (selectedSection) {
      case "createNavigation":
        return "Navigation";
      case "createWelcomeSection":
        return "Text | Image";
      case "createMainSection":
        return "Text";
      case "createTableSection":
        return "Table";
      case "createMap":
        return "Text | Map";
      case "createFooter":
        return "Footer";
      default:
        return "Unknown Section";
    }
  };

  return (
    <>
      <div className='flex flex-col w-full items-center'>
        <PromptDialog question={parseFormValues(originalFormValues.formValues)} />
        <div className='w-full lg:w-3/4 px-4'>
          <div className='mb-4'>
            <div className='bg-white flex flex-col items-center border border-black rounded'>
              <h2
                className='bg-black text-white text-lg font-bold w-full p-3 h-12 flex items-center uppercase cursor-pointer'
                onClick={toggleCodeVisibility}
              >
                {codeVisible ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-7 h-7 pr-1'
                  >
                    <path
                      fillRule='evenodd'
                      d='M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-7 h-7 pr-1'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
                Code
              </h2>
              {codeVisible && (
                <div className='w-full pt-4 px-4'>
                  <textarea
                    ref={codeTextarea}
                    id='code'
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                    }}
                    rows={15}
                    cols={50}
                    className='font-mono border pt-2 w-full bg-slate-100 border-gray-300 rounded-lg overflow-y-scroll resize-none'
                  ></textarea>
                </div>
              )}

              <div className='py-4 space-x-2 flex flex-wrap justify-center'>
                <button onClick={handleCopy} className='bg-black text-white py-2 px-4 rounded m-1'>
                  Copy
                </button>
                <button
                  onClick={handleSaveToFile}
                  className='bg-black hover:bg-green-500 duration-150 text-white py-2 px-4 rounded m-1'
                >
                  Save as HTML
                </button>
              </div>
              <div className='flex'>
                <EditForms
                  originalFormValues={originalFormValues}
                  setSelectedSection={setSelectedSection}
                  selectedSection={selectedSection}
                  getSectionDetails={getSectionDetails}
                />
                <DragDropList setSelectedSection={setSelectedSection} getSectionDetails={getSectionDetails} />
              </div>
            </div>
          </div>
          {/*
        <div className="mb-4">
          <button
            onClick={handleRunCode}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Show preview
          </button>
        </div>*/}
          <div className='mb-4'>
            <div className='bg-white flex flex-col items-center border border-black rounded'>
              <h2
                className='bg-black text-white text-lg font-bold w-full p-3 h-12 flex items-center uppercase cursor-pointer'
                onClick={togglePreviewVisibility}
              >
                {previewVisible ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-7 h-7 pr-1'
                  >
                    <path
                      fillRule='evenodd'
                      d='M11.47 2.47a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06l-6.22-6.22V21a.75.75 0 01-1.5 0V4.81l-6.22 6.22a.75.75 0 11-1.06-1.06l7.5-7.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-7 h-7 pr-1'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
                Preview
              </h2>
              <iframe
                ref={previewFrame}
                title='Code preview'
                sandbox='allow-same-origin allow-scripts'
                width='100%'
                height={500}
                className={previewVisible ? "border-black bg-slate-100 resize" : "hidden"}
              />
            </div>
            {previewVisible && (
              <div id='resizePreview' className='pt-1 w-full flex flex-row-reverse'>
                <button className='rounded-md p-1 hover:bg-black hover:text-white hover:border-2 border-black font-bold cursor-pointer'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
                    <path
                      fillRule='evenodd'
                      d='M2.25 5.25a3 3 0 013-3h13.5a3 3 0 013 3V15a3 3 0 01-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 01-.53 1.28h-9a.75.75 0 01-.53-1.28l.621-.622a2.25 2.25 0 00.659-1.59V18h-3a3 3 0 01-3-3V5.25zm1.5 0v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                <button className='rounded-md p-1 hover:bg-black hover:text-white border-2 border-transparent border-black font-bold cursor-pointer'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-5 h-5'>
                    <path d='M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z' />
                    <path
                      fillRule='evenodd'
                      d='M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancedResult;
