"use client"

import React from "react";
import { ContentCanvas } from "../../layouts/auth-layout";
import { FieldDescription, FieldGroup, FieldSet, FieldTitle } from "../../ui/field";
import BackButton from "../back-button";

export default function DetailDataPage({
    listData
}: {
    listData: {
        title: string
        content: {
            label: string,
            value: string | React.ReactNode
        }[]
    }[]
}) {
    return (

        <FieldGroup>
            {
                listData.map((data: any, index: number) => (
                    <ContentCanvas key={index}>
                        {
                            index == 0 &&
                            <BackButton />
                        }
                        <FieldGroup>
                            <h1 className="font-semibold mb-2 text-xl">{data.title}</h1>
                            <FieldSet>
                                {
                                    data.content.map((item: any, index: number) => (
                                        <div className="space-y-1" key={index}>
                                            <FieldDescription>{item.label}:</FieldDescription>
                                            <FieldTitle>{item.value || "-"}</FieldTitle>
                                        </div>
                                    ))
                                }
                            </FieldSet>
                        </FieldGroup>
                    </ContentCanvas>
                ))
            }
        </FieldGroup>
    )
}
