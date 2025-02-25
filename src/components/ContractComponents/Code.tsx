import styles from "./Code.module.css"
import { useCallback, useEffect, useState } from "react"
import { fileGET, fileListGET } from "../../api/FilesApi"
import { setFileNameLength } from "../../helpers/helpers"
import { useContract } from "../../context/ContractContext";

export function Code() {
    const pageContext = useContract();
    const [fileList, setFileList] = useState<string[]>([])
    const [currentCode, setCurrentCode] = useState<string[]>([])
    const [currentFile, setCurrentFile] = useState("")
    const [fileListOpen, setFileListOpen] = useState(false)

    const chooseFile = useCallback(
        (fileNumber: number) => {
            let filePromise = fileGET(pageContext.source, fileNumber)
            filePromise.then((data) => {
                let parsedText = data.text.replaceAll("\n\n", "\n \n")
                setCurrentCode(parsedText.split("\n"))
            })
        },
        [pageContext.source]
    )

    useEffect(() => {
        let fileListPromise = fileListGET(pageContext.source)
        fileListPromise.then((contractFiles) => {
            if (contractFiles.files.length) {
                setFileList(contractFiles.files)
                setCurrentFile(contractFiles.files[0])
            }
        })

        chooseFile(0)
    }, [pageContext.source, chooseFile])

    function FileListButton() {
        if (fileList.length > 1) {
            return fileListOpen ? (
                <></>
            ) : (
                <button
                    type={"button"}
                    className={styles.fileListButton}
                    onClick={() => {
                        setFileListOpen(true)
                    }}
                >
                    <p>{setFileNameLength(currentFile)}</p>
                    <p>|</p>
                    <img src={"/icons/file-list-arrow.svg"} alt={"file list arrow"} />
                </button>
            )
        } else {
            return (
                <div className={styles.oneFileButton}>
                    <p>{setFileNameLength(currentFile)}</p>
                </div>
            )
        }
    }

    return (
        <div className={styles.codeWrapper}>
            <FileListButton />
            {fileListOpen ? (
                <div className={styles.fileList}>
                    <div
                        className={styles.currentFileRow}
                        onClick={() => {
                            setFileListOpen(false)
                        }}
                    >
                        <p>{setFileNameLength(currentFile)}</p>
                        <p>|</p>
                        <img
                            src={"/icons/file-list-arrow.svg"}
                            alt={"file list arrow"}
                            style={{ transform: "rotate(180deg)" }}
                        />
                    </div>
                    {fileList &&
                        fileList.map((name, i) => {
                            return name === currentFile ? (
                                <></>
                            ) : (
                                <p
                                    key={i.toString()}
                                    onClick={() => {
                                        chooseFile(i)
                                        setFileListOpen(false)
                                        setCurrentFile(name)
                                    }}
                                    className={styles.fileRow}
                                >
                                    {setFileNameLength(name)}
                                </p>
                            )
                        })}
                </div>
            ) : (
                <></>
            )}
            <div className={styles.code}>
                {currentCode &&
                    currentCode.map((text, i) => {
                        return (
                            <p key={i.toString()} style={{ whiteSpace: "pre" }}>
                                {text}
                            </p>
                        )
                    })}
                <p style={{ height: 20}}></p>
            </div>
        </div>
    )
}
